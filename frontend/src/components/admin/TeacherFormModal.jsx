import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

const TeacherFormModal = ({ teacher, onClose }) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    email: "",
    employeeId: "",
  });

  useEffect(() => {
    if (teacher) {
      setForm({
        name: teacher.user?.name || "",
        email: teacher.user?.email || "",
        employeeId: teacher.employeeId || "",
      });
    }
  }, [teacher]);

  const mutation = useMutation({
    mutationFn: (data) =>
      teacher
        ? api.put(`/teachers/${teacher._id}`, data)
        : api.post("/teachers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {teacher ? "Edit Teacher" : "Add Teacher"}
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
            placeholder="Employee ID"
            className="w-full border p-2 rounded"
            value={form.employeeId}
            onChange={(e) =>
              setForm({ ...form, employeeId: e.target.value })
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
              {teacher ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherFormModal;
