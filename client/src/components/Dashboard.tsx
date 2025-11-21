// src/components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { api, getCourses, getMyApplication } from '@/utils/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [application, setApplication] = useState<any>(null);
  const [courses, setCourses] = useState<any>([]);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;

    const fetchMyApplication = async () => {
      try {
        const res = await getMyApplication();
        setApplication(res.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setApplication(null);
        } else {
          console.error('Could not fetch application:', err);
        }
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await getCourses();
        setCourses(res.data);
      } catch (err) {
        console.error('Could not fetch courses:', err);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchMyApplication();
    fetchCourses();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <div>Loading user information...</div>;

  return (
    <div className="container mx-auto p-4">

      {/* TOP SECTION */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      {/* STUDENT VIEW */}
      {user.role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* --- My Application Card --- */}
          <Card>
            <CardHeader>
              <CardTitle>My Application</CardTitle>
              <CardDescription>
                Check the status of your application or submit a new one.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {application ? (
                <div>
                  <p><strong>Status:</strong> {application.status}</p>
                  <p><strong>Desired Course:</strong> {application.desiredCourse}</p>
                </div>
              ) : (
                <div>
                  <p>You have not submitted an application yet.</p>
                  <Link to="/apply" className="text-blue-600 hover:underline">
                    Submit a new application
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* --- Available Courses Card --- */}
          <Card>
            <CardHeader>
              <CardTitle>Available Courses</CardTitle>
              <CardDescription>
                See all courses offered by the institute.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {coursesLoading ? (
                <p>Loading courses...</p>
              ) : courses.length > 0 ? (
                <ul>
                  {courses.map((course: any) => (
                    <li key={course._id} className="mb-2">
                      {course.title} — ${course.tuition}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No courses available at the moment.</p>
              )}
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
