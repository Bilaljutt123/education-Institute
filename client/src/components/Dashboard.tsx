import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getMyApplications, getCourses, getApplicationsWithDetails } from '@/utils/api';
import type { Application, Course, ApplicationWithDetails } from '@/types';
import { BookOpen, GraduationCap, CheckCircle, Clock, XCircle, Calendar, User, FileText } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [adminApplications, setAdminApplications] = useState<ApplicationWithDetails[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(true);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');

  // Get enrolled courses (accepted applications) for students
  const enrolledCourses = myApplications.filter(app => app.status === 'accepted');
  
  useEffect(() => {
    if (!user) return;

    const loadDashboard = async () => {
      setLoading(true);

      try {
        if (user.role === 'student') {
          try {
            const res = await getMyApplications();
            setMyApplications(res.data);
          } catch (err: any) {
            if (err.response?.status !== 404) {
              console.error('Error fetching applications:', err);
            }
          }

          try {
            const coursesRes = await getCourses();
            setCourses(coursesRes.data);
          } catch (err) {
            console.error('Error fetching courses:', err);
          } finally {
            setCoursesLoading(false);
          }
        } else if (user.role === 'admin') {
          try {
            const [appsRes, coursesRes] = await Promise.all([
              getApplicationsWithDetails(),
              getCourses()
            ]);
            setAdminApplications(appsRes.data);
            setCourses(coursesRes.data);
          } catch (err) {
            console.error('Error fetching admin data:', err);
          } finally {
            setCoursesLoading(false);
          }
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  // Find course details for enrolled student
  const getCourseDetails = (courseTitle: string) => {
    return courses.find(c => c.title === courseTitle);
  };

  // Filter accepted students for admin view
  const getAcceptedStudents = () => {
    const now = new Date();
    const filtered = adminApplications.filter(app => {
      const isAccepted = app.status === 'accepted';
      const matchesCourse = selectedCourseFilter === 'all' || 
        (app.desiredCourse || app.course?.title) === selectedCourseFilter;
      
      // Date filtering
      let matchesDate = true;
      if (selectedDateFilter !== 'all') {
        const enrollmentDate = new Date(app.createdAt);
        const daysAgo = parseInt(selectedDateFilter);
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        matchesDate = enrollmentDate >= cutoffDate;
      }
      
      return isAccepted && matchesCourse && matchesDate;
    });

    // Sort by latest enrollment date first
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  if (!user) return <div>Loading user information...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-200">
            {user.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
          </h1>
          <p className="text-xl text-purple-200">Welcome back, {user.name}</p>
        </div>

        {/* STUDENT VIEW */}
        {user.role === 'student' && (
          <div className="space-y-6">
            {/* Profile Status */}
            {!user.profileCompleted && (
              <div className="bg-orange-500/20 backdrop-blur-md border border-orange-500/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white text-xl">⚠️</span>
                  </div>
                  <div>
                    <p className="text-orange-200 font-medium">Profile Incomplete</p>
                    <p className="text-orange-300 text-sm">Please complete your profile before submitting applications.</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="ml-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Complete Profile
                  </Link>
                </div>
              </div>
            )}

            {/* MY ENROLLED COURSES */}
            {enrolledCourses.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">My Courses</h2>
                    <p className="text-purple-200 text-sm">Courses you're currently enrolled in</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {enrolledCourses.map((enrollment) => {
                    const courseDetails = getCourseDetails(enrollment.desiredCourse);
                    
                    return (
                      <Link
                        key={enrollment._id}
                        to={`/my-courses/${enrollment.desiredCourse}`}
                        className="block"
                      >
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30">
                          {/* Course Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
                              <span className="text-green-200 font-semibold text-xs">ENROLLED</span>
                            </div>
                          </div>

                          {/* Course Title */}
                          <h3 className="text-xl font-bold text-white mb-2">
                            {enrollment.desiredCourse}
                          </h3>

                          {/* Course Details */}
                          {courseDetails && (
                            <div className="space-y-2 mb-4">
                              <p className="text-purple-200 text-sm line-clamp-2">
                                {courseDetails.description}
                              </p>
                              
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 text-purple-300">
                                  <Clock className="w-4 h-4" />
                                  <span>{courseDetails.duration}</span>
                                </div>
                                {courseDetails.instructor && (
                                  <div className="flex items-center gap-2 text-purple-300">
                                    <User className="w-4 h-4" />
                                    <span>{courseDetails.instructor}</span>
                                  </div>
                                )}
                              </div>

                              {courseDetails.schedule && (
                                <div className="flex items-center gap-2 text-purple-300 text-sm">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {new Date(courseDetails.schedule.startDate).toLocaleDateString()} - {new Date(courseDetails.schedule.endDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Quick Links */}
                          <div className="pt-4 border-t border-white/10">
                            <span className="text-purple-300 text-sm hover:text-white transition-colors">
                              View Course Materials & Assignments →
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Applications */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">My Applications</h2>
                      <p className="text-purple-200 text-sm">Track your application status</p>
                    </div>
                  </div>
                  <Link 
                    to="/apply" 
                    className="px-3 py-1.5 bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 hover:text-white rounded-lg text-sm transition-colors border border-purple-500/30"
                  >
                    + New Application
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : myApplications.length > 0 ? (
                  <div className="space-y-3">
                    {myApplications.map((app) => (
                      <div key={app._id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-white font-medium">{app.desiredCourse}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {app.status === 'accepted' && <CheckCircle className="w-4 h-4 text-green-400" />}
                          {app.status === 'pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                          {app.status === 'rejected' && <XCircle className="w-4 h-4 text-red-400" />}
                          <span className={`text-sm font-semibold ${
                            app.status === 'accepted' ? 'text-green-400' :
                            app.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {app.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-purple-300 text-xs mt-2">
                          Submitted: {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-purple-200 mb-4">No applications submitted yet</p>
                    <Link 
                      to="/apply" 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Submit Application
                    </Link>
                  </div>
                )}
              </div>

              {/* Available Courses */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Available Courses</h2>
                    <p className="text-purple-200 text-sm">Browse course offerings</p>
                  </div>
                </div>

                {coursesLoading ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : courses.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {courses.map((course) => {
                      const isEnrolled = myApplications.some(
                        app => app.desiredCourse === course.title && app.status === 'accepted'
                      );

                      if (isEnrolled) {
                        return (
                          <Link
                            key={course._id} 
                            to={`/my-courses/${course.title}`}
                            className="block p-4 bg-white/5 border border-white/10 rounded-xl opacity-80 hover:opacity-100 transition-all"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-white font-semibold">{course.title}</h3>
                                <p className="text-purple-200 text-sm mt-1 line-clamp-2">{course.description}</p>
                              </div>
                              <span className="px-2 py-1 bg-green-500/20 text-green-200 text-xs rounded-full border border-green-500/50">
                                Enrolled
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-purple-300 text-sm">{course.duration}</span>
                              <span className="text-green-400 font-semibold">${course.tuition}</span>
                            </div>
                          </Link>
                        );
                      }

                      return (
                        <Link 
                          key={course._id} 
                          to={`/courses/${course._id}`}
                          className="block p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                        >
                          <h3 className="text-white font-semibold">{course.title}</h3>
                          <p className="text-purple-200 text-sm mt-1 line-clamp-2">{course.description}</p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-purple-300 text-sm">{course.duration}</span>
                            <span className="text-green-400 font-semibold">${course.tuition}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-purple-200 text-center py-8">No courses available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN VIEW */}
        {user.role === 'admin' && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/manage-applications" className="group relative">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                  {/* Application Count Badge */}
                  {adminApplications.filter(app => app.status === 'pending').length > 0 && (
                    <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 border-4 border-slate-900 flex items-center justify-center shadow-lg shadow-yellow-500/50 animate-pulse">
                      <span className="text-white font-bold text-lg">{adminApplications.filter(app => app.status === 'pending').length}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <span className="text-white">→</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Manage Applications</h3>
                  <p className="text-purple-200 text-sm">Review and process student applications</p>
                </div>
              </Link>

              <Link to="/manage-courses" className="group">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <span className="text-white">→</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Manage Courses</h3>
                  <p className="text-purple-200 text-sm">View and edit existing courses</p>
                </div>
              </Link>

              <Link to="/create-course" className="group">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <span className="text-white">→</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Create Course</h3>
                  <p className="text-purple-200 text-sm">Add new courses to the curriculum</p>
                </div>
              </Link>
            </div>

            {/* Course Enrollments Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Course Enrollments</h2>
                    <p className="text-purple-200 text-sm">View accepted students by course and date</p>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Course Filter Dropdown */}
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                    <BookOpen className="w-5 h-5 text-purple-300" />
                    <select
                      value={selectedCourseFilter}
                      onChange={(e) => setSelectedCourseFilter(e.target.value)}
                      className="bg-transparent text-white border-none focus:ring-0 cursor-pointer min-w-[150px] [&>option]:text-slate-900"
                    >
                      <option value="all">All Courses</option>
                      {courses.map(course => (
                        <option key={course._id} value={course.title}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range Filter Dropdown */}
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                    <Calendar className="w-5 h-5 text-purple-300" />
                    <select
                      value={selectedDateFilter}
                      onChange={(e) => setSelectedDateFilter(e.target.value)}
                      className="bg-transparent text-white border-none focus:ring-0 cursor-pointer min-w-[150px] [&>option]:text-slate-900"
                    >
                      <option value="all">All Time</option>
                      <option value="7">Last 7 Days</option>
                      <option value="30">Last 30 Days</option>
                      <option value="90">Last 90 Days</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Accepted Students List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Enrolled Course</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Enrollment Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {getAcceptedStudents().length > 0 ? (
                      getAcceptedStudents().map((app) => (
                        <tr key={app._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-white font-medium">{app.firstName} {app.lastName}</td>
                          <td className="px-6 py-4 text-purple-200">{app.email}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-200 border border-green-500/50 text-sm">
                              <BookOpen className="w-3 h-3" />
                              {app.desiredCourse || app.course?.title}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-purple-200">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-purple-200">
                          No enrolled students found for the selected course.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
