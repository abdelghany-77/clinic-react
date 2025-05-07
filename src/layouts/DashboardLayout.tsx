import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Menu, 
  X, 
  User, 
  Calendar, 
  ClipboardList, 
  Users, 
  Home, 
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDoctor = user?.role === 'doctor';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const patientLinks = [
    { to: '/patient/dashboard', icon: <Home className="mr-2 h-5 w-5" />, text: 'Dashboard' },
    { to: '/patient/book-appointment', icon: <Calendar className="mr-2 h-5 w-5" />, text: 'Book Appointment' },
    { to: '/patient/medical-records', icon: <ClipboardList className="mr-2 h-5 w-5" />, text: 'Medical Records' },
    { to: '/patient/profile', icon: <User className="mr-2 h-5 w-5" />, text: 'My Profile' },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', icon: <Home className="mr-2 h-5 w-5" />, text: 'Dashboard' },
    { to: '/doctor/patients', icon: <Users className="mr-2 h-5 w-5" />, text: 'Patients' },
    { to: '/doctor/appointments', icon: <Calendar className="mr-2 h-5 w-5" />, text: 'Appointments' },
    { to: '/doctor/profile', icon: <Settings className="mr-2 h-5 w-5" />, text: 'Settings' },
  ];

  const links = isDoctor ? doctorLinks : patientLinks;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block md:hidden mr-2"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <Link to={`/${user?.role}/dashboard`} className="flex items-center">
            <Heart className="h-7 w-7 text-blue-500" />
            <span className="ml-2 text-xl font-semibold text-gray-800">MediCare</span>
          </Link>
        </div>
        
        <div className="flex items-center">
          <div className="mr-4 text-right hidden sm:block">
            <p className="font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500">{isDoctor ? 'Doctor' : 'Patient'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </header>

      <div className="flex-grow flex">
        {/* Sidebar for mobile */}
        <div 
          className={`fixed inset-0 z-20 transition-opacity ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>

        <aside 
          className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-30 transition-transform transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:z-0`}
        >
          <div className="h-16 flex items-center justify-between px-4 md:hidden">
            <div className="flex items-center">
              <Heart className="h-7 w-7 text-blue-500" />
              <span className="ml-2 text-xl font-semibold text-gray-800">MediCare</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          <nav className="px-4 py-6 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.icon}
                <span>{link.text}</span>
              </Link>
            ))}
            
            <hr className="my-4 border-gray-200" />
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;