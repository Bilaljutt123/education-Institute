// src/components/Navbar.tsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            </>
          ) : (
            <>
              <Link to="/apply" className="text-white hover:text-gray-300">
                Apply
              </Link>
              <Link to="/courses" className="text-white hover:text-gray-300">
                Courses
              </Link>
            </>
          )}
          <Button onClick={handleLogout} variant="secondary">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;