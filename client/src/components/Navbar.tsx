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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);

  // Check if we're on the landing page
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navbarClasses = isLandingPage
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200'
          : 'bg-transparent'
      }`
    : 'bg-gradient-to-r from-purple-900 via-purple-800 to-pink-900 shadow-lg border-b border-purple-700/50';

  const linkClasses = (path: string) => {
    const isActive = location.pathname === path;
    const baseClasses = 'px-4 py-2 rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2';
    
    if (isLandingPage && !isScrolled) {
      return `${baseClasses} ${
        isActive
          ? 'bg-white/20 backdrop-blur-md text-white'
          : 'text-white hover:bg-white/10 hover:backdrop-blur-md'
      }`;
    } else if (isLandingPage && isScrolled) {
      return `${baseClasses} ${
        isActive
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`;
    } else {
      return `${baseClasses} ${
        isActive
          ? 'bg-white/20 backdrop-blur-md text-white'
          : 'text-purple-100 hover:bg-white/10 hover:backdrop-blur-md hover:text-white'
      }`;
    }
  };

  const textColor = isLandingPage && !isScrolled ? 'text-white' : isLandingPage ? 'text-gray-900' : 'text-white';
  const hoverColor = isLandingPage && !isScrolled ? 'hover:text-purple-200' : isLandingPage ? 'hover:text-purple-600' : 'hover:text-purple-200';

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link 
            to="/" 
            className={`text-2xl font-bold ${textColor} ${hoverColor} transition-colors duration-300 flex items-center gap-2 group`}
          >
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
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
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 border-2 border-purple-900 flex items-center justify-center text-[10px] font-bold text-white">
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
                  className="ml-2 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
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
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${textColor} ${hoverColor} transition-colors`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-4 py-4 rounded-2xl ${
            isLandingPage && !isScrolled 
              ? 'bg-white/10 backdrop-blur-lg border border-white/20' 
              : isLandingPage 
              ? 'bg-gray-50 border border-gray-200'
              : 'bg-purple-800/50 backdrop-blur-lg border border-purple-700/50'
          }`}>
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
                          <span className="ml-auto w-6 h-6 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 border-2 border-purple-900 flex items-center justify-center text-xs font-bold text-white">
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
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2"
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
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 text-center"
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
