import axios from "axios";

// Minimal MPesa STK Push utility (Safaricom-style).
// Make sure .env contains correct MPESA_* variables.

const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const { data } = await axios.get(process.env.MPESA_TOKEN_URL, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  return data.access_token;
};

export const initiateStkPush = async ({
  amount,
  phoneNumber,
  accountReference,
  description,
}) => {
  const token = await getAccessToken();

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);

  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: description || "School fees payment",
  };

  const { data } = await axios.post(process.env.MPESA_STK_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
