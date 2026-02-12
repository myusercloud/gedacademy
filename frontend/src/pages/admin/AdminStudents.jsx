import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import StudentFormModal from "../../components/admin/StudentFormModal";

const PAGE_SIZE = 40;

const AdminStudents = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => api.get("/students").then(res => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/students/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
    },
  });

  const filtered = students.filter((s) =>
    s.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const openCreate = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const openEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading students...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Students</h1>
          <button
            onClick={openCreate}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Student
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by name..."
          className="w-full border rounded-lg px-4 py-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Admission</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((student) => (
                <tr key={student._id} className="border-t">
                  <td className="p-3">{student.user?.name}</td>
                  <td className="p-3">{student.admissionNumber}</td>
                  <td className="p-3">
                    {student.class?.name} {student.class?.section}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => openEdit(student)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Delete this student?")) {
                          deleteMutation.mutate(student._id);
                        }
                      }}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-slate-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-primary-600 text-white"
                  : "bg-slate-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {isModalOpen && (
          <StudentFormModal
            student={selectedStudent}
            onClose={closeModal}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
