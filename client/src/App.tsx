// src/App.tsx

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppContent from './AppContent'; // Import the new component
import './index.css'; // Make sure to import your global styles

function App() {
  return (
    <AuthProvider>
      <AppContent /> {/* Render the component that USES the context */}
    </AuthProvider>
  );
}

export default App;