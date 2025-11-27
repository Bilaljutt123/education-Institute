// src/components/Navbar.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X, LogOut, LayoutDashboard, FileText, BookOpen, User } from 'lucide-react';
import { getApplicationsWithDetails } from '@/utils/api';
import type { ApplicationWithDetails } from '@/types';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar = ({ onLogout }: NavbarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);

  // Check if we're on the landing page
  const isLandingPage = location.pathname === '/';

  // Fetch applications for admin users
  useEffect(() => {
    const fetchApplications = async () => {
      if (user?.role === 'admin') {
        try {
          const res = await getApplicationsWithDetails();
          setApplications(res.data);
        } catch (err) {
          console.error('Error fetching applications:', err);
        }
      }
    };

    fetchApplications();
  }, [user, location]); // Refetch when location changes

  const navbarClasses = 'bg-white shadow-sm border-b border-gray-200';

  const linkClasses = (path: string) => {
    const isActive = location.pathname === path;
    const baseClasses = 'px-4 py-2 rounded font-medium transition-all duration-200 inline-flex items-center gap-2';
    
    return `${baseClasses} ${
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-700 hover:bg-gray-100'
    }`;
  };

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-gray-900 hover:text-blue-700 transition-colors duration-300 flex items-center gap-2 group"
          >
            <div className="p-2 rounded bg-blue-600 group-hover:bg-blue-700 transition-colors">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-700">
              EduInstitute
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                {/* Logged-in user links */}
                <Link to="/dashboard" className={linkClasses('/dashboard')}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link to="/profile" className={linkClasses('/profile')}>
                  <User className="w-4 h-4" />
                  Profile
                </Link>

                {/* Admin-only links */}
                {user.role === "admin" && (
                  <>
                    <Link to="/manage-applications" className={`${linkClasses('/manage-applications')} relative`}>
                      <FileText className="w-4 h-4" />
                      Applications
                      {applications.filter(app => app.status === 'pending').length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                          {applications.filter(app => app.status === 'pending').length}
                        </span>
                      )}
                    </Link>

                    <Link to="/manage-courses" className={linkClasses('/manage-courses')}>
                      <BookOpen className="w-4 h-4" />
                      Courses
                    </Link>
                  </>
                )}

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="ml-2 px-6 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Public links when NOT logged in */}
                <Link to="/" className={linkClasses('/')}>
                  Home
                </Link>

                <Link to="/register" className={linkClasses('/register')}>
                  Register
                </Link>

                <Link 
                  to="/login"
                  className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-all duration-300"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 rounded bg-white border border-gray-200">
            <div className="flex flex-col space-y-2 px-4">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`${linkClasses('/dashboard')} justify-start`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  <Link 
                    to="/profile" 
                    className={`${linkClasses('/profile')} justify-start`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>

                  {user.role === "admin" && (
                    <>
                      <Link 
                        to="/manage-applications" 
                        className={`${linkClasses('/manage-applications')} justify-start relative`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FileText className="w-4 h-4" />
                        Applications
                        {applications.filter(app => app.status === 'pending').length > 0 && (
                          <span className="ml-auto w-6 h-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                            {applications.filter(app => app.status === 'pending').length}
                          </span>
                        )}
                      </Link>

                      <Link 
                        to="/manage-courses" 
                        className={`${linkClasses('/manage-courses')} justify-start`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <BookOpen className="w-4 h-4" />
                        Courses
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-6 py-3 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-all duration-300 inline-flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    className={`${linkClasses('/')} justify-start`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>

                  <Link 
                    to="/register" 
                    className={`${linkClasses('/register')} justify-start`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>

                  <Link 
                    to="/login"
                    className="px-6 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-all duration-300 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
