// src/components/Layout.tsx

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if we're on the landing page
  const isLandingPage = location.pathname === '/';

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <main className={isLandingPage ? '' : ''}>
        {children}
      </main>
    </>
  );
};

export default Layout;