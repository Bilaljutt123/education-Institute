// src/components/Layout.tsx

import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <main className="p-4">
        {children}
      </main>
    </>
  );
};

export default Layout;