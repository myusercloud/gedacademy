import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary-600">
              School Management
            </Link>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{user.name}</span>
              <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
