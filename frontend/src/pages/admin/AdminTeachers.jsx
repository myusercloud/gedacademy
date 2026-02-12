import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import TeacherFormModal from "../../components/admin/TeacherFormModal";

const PAGE_SIZE = 40;

const AdminTeachers = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => api.get("/teachers").then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/teachers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.user?.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeachers.length / PAGE_SIZE);
  const paginatedTeachers = filteredTeachers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teachers</h1>

          <button
            onClick={() => {
              setSelectedTeacher(null);
              setShowModal(true);
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg"
          >
            + Add Teacher
          </button>
        </div>

        <input
          type="text"
          placeholder="Search teachers..."
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {isLoading ? (
          <div>Loading teachers...</div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Employee ID</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTeachers.map((teacher) => (
                  <tr key={teacher._id} className="border-t">
                    <td className="p-3">{teacher.user?.name}</td>
                    <td className="p-3">{teacher.user?.email}</td>
                    <td className="p-3">{teacher.employeeId}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowModal(true);
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteMutation.mutate(teacher._id)
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center p-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-slate-200 rounded"
              >
                Prev
              </button>

              <span>
                Page {page} of {totalPages || 1}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-slate-200 rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <TeacherFormModal
          teacher={selectedTeacher}
          onClose={() => setShowModal(false)}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminTeachers;
