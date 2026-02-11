import DashboardLayout from '../../layouts/DashboardLayout';

const StudentDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-2">Attendance</h2>
            <p className="text-3xl font-bold text-primary-600">-</p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-2">Results</h2>
            <p className="text-3xl font-bold text-primary-600">-</p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-2">Fees Balance</h2>
            <p className="text-3xl font-bold text-primary-600">-</p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-2">Notices</h2>
            <p className="text-3xl font-bold text-primary-600">-</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-slate-600">No recent activity</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
