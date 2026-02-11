import DashboardLayout from '../../layouts/DashboardLayout';

const TeacherDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-2">My Classes</h2>
            <p className="text-3xl font-bold text-primary-600">-</p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-2">Pending Marks</h2>
            <p className="text-3xl font-bold text-primary-600">-</p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-2">Messages</h2>
            <p className="text-3xl font-bold text-primary-600">-</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="btn-primary">Mark Attendance</button>
            <button className="btn-primary">Enter Marks</button>
            <button className="btn-primary">View Timetable</button>
            <button className="btn-primary">Send Message</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
