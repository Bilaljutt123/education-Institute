// src/AppContent.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ApplicationForm from './components/ApplicationForm';
import Layout from './components/Layout';
import ApplicationsTable from './components/ApplicationsTable';
import ManageCourses from './components/ManageCourses';
import CreateCourse from './components/CreateCourse';
import CourseDetail from './components/CourseDetail';
import StudentProfile from './components/StudentProfile';

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/apply" element={<ApplicationForm />} />
            <Route path="/manage-applications" element={<ApplicationsTable />} />
            <Route path="/manage-courses" element={<ManageCourses />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default AppContent;