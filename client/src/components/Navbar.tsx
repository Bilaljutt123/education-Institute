// src/components/Navbar.tsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar = ({ onLogout }: NavbarProps) => {
  const { user } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/" className="text-white hover:text-gray-300">
            Education Institute
          </Link>
        </div>

        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-white hover:text-gray-300">
                Dashboard
              </Link>

              {user.role === 'admin' && (
                <>
                  <Link to="/manage-applications" className="text-white hover:text-gray-300">
                    Applications
                  </Link>
                  <Link to="/manage-courses" className="text-white hover:text-gray-300">
                    Courses
                  </Link>
                </>
              )}

              {/* Show logout only when logged in */}
              <Button onClick={onLogout} variant="secondary">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/apply" className="text-white hover:text-gray-300">
                Apply
              </Link>

              <Link to="/courses" className="text-white hover:text-gray-300">
                Courses
              </Link>

              {/* NEW: Register link */}
              <Link to="/register" className="text-white hover:text-gray-300">
                Register
              </Link>

              {/* Login link also should show when logged out */}
              <Link to="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
