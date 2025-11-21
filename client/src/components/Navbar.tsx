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

        {/* Logo */}
        <div className="text-xl font-bold">
          <Link to="/" className="text-white hover:text-gray-300">
            Education Institute
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="space-x-4">

          {user ? (
            <>
              {/* Dashboard (visible to all logged-in users) */}
              <Link to="/dashboard" className="text-white hover:text-gray-300">
                Dashboard
              </Link>

              {/* Admin-only links */}
              {user.role === "admin" && (
                <>
                  <Link to="/manage-applications" className="text-white hover:text-gray-300">
                    Applications
                  </Link>

                  <Link to="/manage-courses" className="text-white hover:text-gray-300">
                    Courses
                  </Link>
                </>
              )}

              {/* Logout Button */}
              <Button
                onClick={onLogout}
                variant="secondary"
                className="ml-2"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Public links when NOT logged in */}
              <Link to="/apply" className="text-white hover:text-gray-300">
                Apply
              </Link>

              <Link to="/courses" className="text-white hover:text-gray-300">
                Courses
              </Link>

              <Link to="/register" className="text-white hover:text-gray-300">
                Register
              </Link>

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
