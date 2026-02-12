import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

const StudentFormModal = ({ student, onClose }) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    email: "",
    admissionNumber: "",
  });

  useEffect(() => {
    if (student) {
      setForm({
        name: student.user?.name || "",
        email: student.user?.email || "",
        admissionNumber: student.admissionNumber || "",
      });
    }
  }, [student]);

  const mutation = useMutation({
    mutationFn: (data) =>
      student
        ? api.put(`/students/${student._id}`, data)
        : api.post("/students", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-semibold mb-4">
          {student ? "Edit Student" : "Create Student"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Admission Number"
            className="w-full border p-2 rounded"
            value={form.admissionNumber}
            onChange={(e) =>
              setForm({ ...form, admissionNumber: e.target.value })
            }
            required
          />

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded"
            >
              {student ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;
