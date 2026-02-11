import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/students', label: 'Students', icon: '👨‍🎓' },
    { to: '/admin/teachers', label: 'Teachers', icon: '👩‍🏫' },
    { to: '/admin/parents', label: 'Parents', icon: '👨‍👩‍👧' },
    { to: '/admin/classes', label: 'Classes', icon: '🏫' },
    { to: '/admin/subjects', label: 'Subjects', icon: '📚' },
    { to: '/admin/timetables', label: 'Timetables', icon: '📅' },
    { to: '/admin/attendance', label: 'Attendance', icon: '✅' },
    { to: '/admin/exams', label: 'Exams', icon: '📝' },
    { to: '/admin/fees', label: 'Fees', icon: '💰' },
    { to: '/admin/notices', label: 'Notices', icon: '📢' },
    { to: '/admin/cms', label: 'CMS', icon: '🌐' },
    { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const teacherLinks = [
    { to: '/teacher', label: 'Dashboard', icon: '📊' },
    { to: '/teacher/attendance', label: 'Attendance', icon: '✅' },
    { to: '/teacher/marks', label: 'Enter Marks', icon: '📝' },
    { to: '/teacher/timetable', label: 'Timetable', icon: '📅' },
    { to: '/teacher/messages', label: 'Messages', icon: '💬' },
  ];

  const studentLinks = [
    { to: '/student', label: 'Dashboard', icon: '📊' },
    { to: '/student/attendance', label: 'Attendance', icon: '✅' },
    { to: '/student/results', label: 'Results', icon: '📝' },
    { to: '/student/timetable', label: 'Timetable', icon: '📅' },
    { to: '/student/fees', label: 'Fees', icon: '💰' },
    { to: '/student/notices', label: 'Notices', icon: '📢' },
  ];

  const parentLinks = [
    { to: '/parent', label: 'Dashboard', icon: '📊' },
    { to: '/parent/children', label: 'Children', icon: '👨‍👩‍👧' },
    { to: '/parent/messages', label: 'Messages', icon: '💬' },
  ];

  const getLinks = () => {
    if (user?.role === 'admin') return adminLinks;
    if (user?.role === 'teacher') return teacherLinks;
    if (user?.role === 'student') return studentLinks;
    if (user?.role === 'parent') return parentLinks;
    return [];
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-slate-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
