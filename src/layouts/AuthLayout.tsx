import { Outlet } from 'react-router-dom';
import { Heart } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-xl font-semibold text-gray-800">MediCare Clinic</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} MediCare Clinic. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;