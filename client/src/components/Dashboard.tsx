import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { getMyApplications, getApplications, getCourses } from '@/utils/api';
import type { Application, Course } from '@/types';
import ApplicationList from './ApplicationList';
import CourseCard from './CourseCard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [myApplications, setMyApplications] = useState<Application[]>([]); // Changed to array
  const [applications, setApplications] = useState<Application[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  useEffect(() => {
    if (!user) return;

    const loadDashboard = async () => {
      setLoading(true);

      try {
        // ============================
        // STUDENT LOGIC
        // ============================
        if (user.role === 'student') {
          // Fetch all student's applications
          try {
            const res = await getMyApplications(); // Changed to getMyApplications
            setMyApplications(res.data);
          } catch (err: any) {
            if (err.response?.status !== 404) {
              console.error('Error fetching applications:', err);
            }
          }

          // Fetch available courses
          try {
            const coursesRes = await getCourses();
            setCourses(coursesRes.data);
          } catch (err) {
            console.error('Error fetching courses:', err);
          } finally {
            setCoursesLoading(false);
          }
        }

        // ============================
        // ADMIN LOGIC
        // ============================
        if (user.role === 'admin') {
          const res = await getApplications();
          setApplications(res.data);
        }

      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  // const handleLogout = () => {
  //   logout();
  //   navigate('/login');
  // };
    const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  if (!user) return <div>Loading user information...</div>;

  return (
    <div className="container mx-auto p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {user.role === 'student' && (
          <div className="flex items-center gap-4">
            {!user.profileCompleted && (
              <div className="text-sm text-orange-600 font-medium">
                ⚠️ Profile Incomplete
              </div>
            )}
            <Link 
              to="/profile" 
              className="text-sm text-blue-600 hover:underline"
            >
              {user.profileCompleted ? 'Edit Profile' : 'Complete Profile'}
            </Link>
          </div>
        )}
      </div>

      {/* =============================== */}
      {/* STUDENT VIEW */}
      {/* =============================== */}
      {user.role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* My Applications */}
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>
                View the status of all your submitted applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading your applications...</p>
              ) : myApplications.length > 0 ? (
                <div className="space-y-3">
                  {myApplications.map((app) => (
                    <div key={app._id} className="p-3 border rounded-lg">
                      <p><strong>Course:</strong> {app.desiredCourse}</p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span
                          className={`font-semibold ${
                            app.status === 'accepted'
                              ? 'text-green-600'
                              : app.status === 'rejected'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {app.status.toUpperCase()}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted: {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p>You have not submitted any applications yet.</p>
                  <Link to="/apply" className="text-blue-600 hover:underline">
                    Submit a new application
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
           {/* --- Available Courses --- */}
          <Card>
            <CardHeader>
              <CardTitle>Available Courses</CardTitle>
              <CardDescription>
                See all courses offered by the institute. Click on a course to see more details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {coursesLoading ? (
                <p>Loading courses...</p>
              ) : courses.length > 0 ? (
                <div className="space-y-3">
                  {courses.map((course: any) => (
                    <Link 
                      key={course._id} 
                      to={`/courses/${course._id}`}
                      className="block"
                    >
                      <div 
                        className="p-3 border rounded-lg hover:bg-gray-50 hover:shadow-md transition-all cursor-pointer"
                      >
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-500">
                            Duration: {course.duration}
                          </span>
                          <span className="font-semibold text-green-600">
                            ${course.tuition}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>No courses available at the moment.</p>
              )}
            </CardContent>
          </Card>

        </div>
      )}

      {/* =============================== */}
      {/* ADMIN VIEW */}
      {/* =============================== */}
      {user.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>All Student Applications</CardTitle>
            <CardDescription>
              Review and manage all applications submitted by students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationList applications={applications} />
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default Dashboard;
