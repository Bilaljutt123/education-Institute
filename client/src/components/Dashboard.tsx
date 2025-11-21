// src/components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Link } from 'react-router-dom';
import { api, getCourses, getMyApplication } from '@/utils/api'; // <-- 1. USE A NAMED IMPORT

// ... (keep your interfaces)

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const [courses, setCourses] = useState<any>([]);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      const fetchMyApplication = async () => {
        try {
          const res = await getMyApplication(); // <-- USE THE TYPED FUNCTION
          setApplication(res.data);
        } catch (err: any) {
          if (err.response && err.response.status === 404) {
            setApplication(null);
          } else {
            console.error('Could not fetch application:', err);
          }
        }
      };

      const fetchCourses = async () => {
        try {
          const res = await getCourses(); // <-- USE THE TYPED FUNCTION
          setCourses(res.data);
        } catch (err) {
          console.error('Could not fetch courses:', err);
        } finally {
          setCoursesLoading(false);
        }
      };

      fetchMyApplication();
      fetchCourses();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* ... (keep the rest of the component the same) */}

      {/* Student View */}
      {user.role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ... (keep the application card) */}
          <Card>
            <CardHeader>
              <CardTitle>Available Courses</CardTitle>
              <CardDescription>
                See all courses offered by the institute.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* 4. USE THE NEW LOADING STATE IN THE JSX */}
              {coursesLoading ? ( // <-- 5. SHOW A LOADING MESSAGE
                <p>Loading courses...</p>
              ) : courses.length > 0 ? (
                <ul>
                  {courses.map((course:any) => (
                    <li key={course._id} className="mb-2">
                      {course.title} - ${course.tuition}
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