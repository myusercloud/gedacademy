import Fee from "../models/Fee.js";
import Student from "../models/Student.js";
import { initiateStkPush } from "../utils/mpesa.js";

export const createFeeRecord = async (req, res) => {
  const fee = await Fee.create(req.body);
  res.status(201).json(fee);
};

export const getFeesByStudent = async (req, res) => {
  const { studentId } = req.params;
  const fees = await Fee.find({ student: studentId }).sort({ year: -1, term: 1 });
  res.json(fees);
};

export const initiateMpesaPayment = async (req, res, next) => {
  try {
    const { feeId, phoneNumber } = req.body;

    const fee = await Fee.findById(feeId).populate("student");
    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    const student = await Student.findById(fee.student._id).populate("user");

    const mpesaRes = await initiateStkPush({
      amount: fee.amount - fee.amountPaid,
      phoneNumber,
      accountReference: student.admissionNumber,
      description: `Fees for ${student.user.name}`,
    });

    fee.mpesaCheckoutRequestId =
      mpesaRes.CheckoutRequestID || mpesaRes.CheckoutRequestId;

    await fee.save();

    res.json({ fee, mpesa: mpesaRes });
  } catch (err) {
    next(err);
  }
};

export const mpesaCallback = async (req, res) => {
  const body = req.body;

  try {
    const callback = body.Body?.stkCallback;
    if (!callback) {
      return res.json({ message: "No callback data" });
    }

    const checkoutId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;

    // Payment successful
    if (resultCode === 0) {
      const metadata = callback.CallbackMetadata?.Item || [];

      const amountItem = metadata.find((i) => i.Name === "Amount");
      const receiptItem = metadata.find((i) => i.Name === "MpesaReceiptNumber");

      const fee = await Fee.findOne({
        mpesaCheckoutRequestId: checkoutId,
      });

      if (fee) {
        fee.amountPaid += amountItem?.Value || 0;
        fee.status = fee.amountPaid >= fee.amount ? "paid" : "partial";
        fee.mpesaReceiptNumber =
          receiptItem?.Value || fee.mpesaReceiptNumber;
        fee.paidAt = new Date();

        await fee.save();
      }
    }

    res.json({ message: "Callback processed" });
  } catch (err) {
    res.status(500).json({ message: "Error processing callback" });
  }
};
