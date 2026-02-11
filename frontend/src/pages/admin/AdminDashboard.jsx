import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { data: overview, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => api.get('/dashboard').then((res) => res.data),
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  const stats = [
    { label: 'Total Students', value: overview?.totalStudents || 0, icon: '👨‍🎓' },
    { label: 'Total Teachers', value: overview?.totalTeachers || 0, icon: '👩‍🏫' },
    { label: 'Total Classes', value: overview?.totalClasses || 0, icon: '🏫' },
    { label: 'Attendance Today', value: overview?.attendanceToday || 0, icon: '✅' },
    { label: 'Fees Collected', value: `KES ${overview?.feesCollectedThisTerm || 0}`, icon: '💰' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Top Performers</h2>
            <div className="space-y-2">
              {overview?.topPerformers?.slice(0, 5).map((perf, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span>{perf._id?.user?.name || 'N/A'}</span>
                  <span className="font-medium">{perf.avgMarks?.toFixed(1) || 0}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-2">
              {overview?.upcomingEvents?.slice(0, 5).map((event, idx) => (
                <div key={idx} className="p-2 bg-slate-50 rounded">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-slate-600">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
