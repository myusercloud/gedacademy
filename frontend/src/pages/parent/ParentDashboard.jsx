import DashboardLayout from '../../layouts/DashboardLayout';

const ParentDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-2">Children</h2>
            <p className="text-3xl font-bold text-primary-600">-</p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-2">Messages</h2>
            <p className="text-3xl font-bold text-primary-600">-</p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-2">Fees Due</h2>
            <p className="text-3xl font-bold text-primary-600">-</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Children Performance</h2>
          <p className="text-slate-600">No data available</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
