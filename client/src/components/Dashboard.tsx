import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getMyApplications, getCourses, getApplicationsWithDetails, getDepartments, getStudentGPA } from '@/utils/api';
import type { Application, Course, ApplicationWithDetails, Department, GPA } from '@/types';
import { BookOpen, GraduationCap, CheckCircle, Clock, XCircle, Calendar, User, FileText, Plus, Building2, TrendingUp, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [adminApplications, setAdminApplications] = useState<ApplicationWithDetails[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(true);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [myGPA, setMyGPA] = useState<GPA[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'courses' | 'applications' | 'gpa'>('overview');

  // Get enrolled courses (accepted applications) for students
  // Flatten the courses array from all accepted applications
  const enrolledCourseIds: string[] = [];
  myApplications.forEach(app => {
    if (app.status === 'accepted' && app.courses) {
      app.courses.forEach(c => {
        enrolledCourseIds.push(typeof c === 'object' ? c._id : c);
      });
    }
  });

  const enrolledCoursesList = courses.filter(c => enrolledCourseIds.includes(c._id));
  
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

          try {
            const gpaRes = await getStudentGPA(user._id);
            setMyGPA(gpaRes.data);
          } catch (err) {
            console.error('Error fetching GPA:', err);
          }
        } else if (user.role === 'admin') {
          try {
            const [appsRes, coursesRes, deptsRes] = await Promise.all([
              getApplicationsWithDetails(),
              getCourses(),
              getDepartments()
            ]);
            setAdminApplications(appsRes.data);
            setCourses(coursesRes.data);
            setDepartments(deptsRes.data);
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

  // Filter accepted students for admin view
  const getAcceptedStudents = () => {
    const now = new Date();
    const filtered = adminApplications.filter(app => {
      const isAccepted = app.status === 'accepted';
      
      // Filter by department
      let matchesDepartment = true;
      if (selectedDepartmentFilter !== 'all') {
        matchesDepartment = false;
        if (app.department) {
          const deptId = typeof app.department === 'object' ? app.department._id : app.department;
          matchesDepartment = deptId === selectedDepartmentFilter;
        }
      }
      
      // Check if the application includes the selected course
      let matchesCourse = true;
      if (selectedCourseFilter !== 'all') {
        matchesCourse = false;
        if (app.courses && Array.isArray(app.courses)) {
           matchesCourse = app.courses.some(c => c.title === selectedCourseFilter);
        }
      }
      
      // Date filtering
      let matchesDate = true;
      if (selectedDateFilter !== 'all') {
        const enrollmentDate = new Date(app.createdAt);
        const daysAgo = parseInt(selectedDateFilter);
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        matchesDate = enrollmentDate >= cutoffDate;
      }
      
      return isAccepted && matchesDepartment && matchesCourse && matchesDate;
    });

    // Sort by latest enrollment date first
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  if (!user) return <div>Loading user information...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
          </h1>
          <p className="text-lg text-gray-600">Welcome back, {user.name}</p>
        </div>

        {/* STUDENT VIEW */}
        {user.role === 'student' && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* SIDEBAR */}
            <div className="w-full lg:w-64 shrink-0 space-y-2">
              <button
                onClick={() => setActiveView('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Overview</span>
              </button>
              
              <button
                onClick={() => setActiveView('gpa')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'gpa' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Academic Record</span>
              </button>

              <button
                onClick={() => setActiveView('courses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'courses' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                <span className="font-medium">My Courses</span>
              </button>

              <button
                onClick={() => setActiveView('applications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'applications' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">My Applications</span>
              </button>

              <Link 
                to="/departments"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                <Building2 className="w-5 h-5" />
                <span className="font-medium">Browse Departments</span>
              </Link>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 space-y-6">
              {/* Profile Status (Always visible if incomplete) */}
              {!user.profileCompleted && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-yellow-700 text-xl">⚠️</span>
                    </div>
                    <div>
                      <p className="text-yellow-900 font-medium">Profile Incomplete</p>
                      <p className="text-yellow-700 text-sm">Please complete your profile before submitting applications.</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="ml-auto px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                    >
                      Complete Profile
                    </Link>
                  </div>
                </div>
              )}

              {/* ACADEMIC RECORD (GPA) */}
              {(activeView === 'overview' || activeView === 'gpa') && myGPA.length > 0 && (
                <div className="bg-white rounded border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Academic Record</h2>
                        <p className="text-gray-600 text-sm">Your GPA performance per semester</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                      <span className="text-sm text-blue-700 font-medium mr-2">CGPA:</span>
                      <span className="text-2xl font-bold text-blue-800">
                        {(myGPA.reduce((acc, curr) => acc + curr.gpa, 0) / myGPA.length).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {myGPA.map((record) => (
                      <div key={record._id} className="bg-gray-50 rounded p-4 border border-gray-200 flex flex-col items-center justify-center text-center">
                        <span className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">
                          Semester {record.semester}
                        </span>
                        <span className={`text-3xl font-bold ${
                          record.gpa >= 3.5 ? 'text-green-600' :
                          record.gpa >= 3.0 ? 'text-blue-600' :
                          record.gpa >= 2.0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {record.gpa.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400 mt-2">
                          {record.department && typeof record.department === 'object' ? record.department.code : 'DEPT'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MY ENROLLED COURSES */}
              {(activeView === 'overview' || activeView === 'courses') && enrolledCoursesList.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                      <p className="text-gray-600 text-sm">Courses you're currently enrolled in</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {enrolledCoursesList.map((course) => (
                      <Link
                        key={course._id}
                        to={`/my-courses/${course.title}`}
                        className="block"
                      >
                        <div className="bg-white rounded border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all">
                          {/* Course Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded bg-blue-50">
                              <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="px-3 py-1 bg-green-50 border border-green-200 rounded">
                              <span className="text-green-700 font-semibold text-xs">ENROLLED</span>
                            </div>
                          </div>

                          {/* Course Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {course.title}
                          </h3>

                          {/* Course Details */}
                          <div className="space-y-2 mb-4">
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {course.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{course.duration}</span>
                              </div>
                              {course.instructor && (
                                <div className="flex items-center gap-2 text-gray-500">
                                  <User className="w-4 h-4" />
                                  <span>{course.instructor}</span>
                                </div>
                              )}
                            </div>

                            {course.schedule && (
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(course.schedule.startDate).toLocaleDateString()} - {new Date(course.schedule.endDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Quick Links */}
                          <div className="pt-4 border-t border-gray-200">
                            <span className="text-blue-600 text-sm hover:text-blue-700 transition-colors">
                              View Course Materials & Assignments →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* MY APPLICATIONS */}
              {(activeView === 'overview' || activeView === 'applications') && (
                <div className="grid grid-cols-1 gap-6">
                  {/* My Applications */}
                  <div className="bg-white rounded border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">My Applications</h2>
                          <p className="text-gray-600 text-sm">Track your application status</p>
                        </div>
                      </div>
                      <Link 
                        to="/departments" 
                        className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm transition-colors"
                      >
                        + New Application
                      </Link>
                    </div>

                    {loading ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      </div>
                    ) : myApplications.length > 0 ? (
                      <div className="space-y-3">
                        {myApplications.map((app) => (
                          <div key={app._id} className="p-4 bg-gray-50 border border-gray-200 rounded">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-gray-900 font-medium">
                                        {app.department && typeof app.department === 'object' ? app.department.name : 'Unknown Department'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {app.courses && app.courses.length > 0 
                                            ? app.courses.map((c: any) => typeof c === 'object' ? c.title : 'Course').join(', ')
                                            : 'No courses selected'}
                                    </p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                    app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                    app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {app.status.toUpperCase()}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                              {app.status === 'accepted' && <CheckCircle className="w-4 h-4 text-green-600" />}
                              {app.status === 'pending' && <Clock className="w-4 h-4 text-yellow-600" />}
                              {app.status === 'rejected' && <XCircle className="w-4 h-4 text-red-600" />}
                              <span className="text-xs text-gray-500">
                                Submitted: {new Date(app.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">No applications submitted yet</p>
                        <Link 
                          to="/departments" 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                        >
                          Browse Departments
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Available Departments (Only show in Overview or Applications view) */}
                  <div className="bg-white rounded border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Building2 className="w-6 h-6 text-blue-600" />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Academic Departments</h2>
                        <p className="text-gray-600 text-sm">Browse programs by department</p>
                      </div>
                    </div>

                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Explore our academic departments to find your perfect program.</p>
                        <Link 
                          to="/departments" 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                        >
                          View All Departments
                        </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ADMIN VIEW */}
        {user.role === 'admin' && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/manage-applications" className="group relative">
                <div className="bg-white rounded border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all h-full">
                  {/* Application Count Badge */}
                  {adminApplications.filter(app => app.status === 'pending').length > 0 && (
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-red-600 border-4 border-white flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">{adminApplications.filter(app => app.status === 'pending').length}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded bg-blue-50">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Applications</h3>
                  <p className="text-gray-600 text-sm">Review and process student applications</p>
                </div>
              </Link>

              <Link to="/manage-courses" className="group">
                <div className="bg-white rounded border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded bg-blue-50">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Courses</h3>
                  <p className="text-gray-600 text-sm">View and edit existing courses</p>
                </div>
              </Link>

              <Link to="/manage-departments" className="group">
                <div className="bg-white rounded border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded bg-blue-50">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Departments</h3>
                  <p className="text-gray-600 text-sm">Oversee academic departments</p>
                </div>
              </Link>

              <Link to="/manage-gpa" className="group">
                <div className="bg-white rounded border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded bg-blue-50">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Manage GPA</h3>
                  <p className="text-gray-600 text-sm">Assign and update student GPAs</p>
                </div>
              </Link>

              <Link to="/create-course" className="group">
                <div className="bg-white rounded border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded bg-blue-50">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Create Course</h3>
                  <p className="text-gray-600 text-sm">Add new courses to the curriculum</p>
                </div>
              </Link>
            </div>

            {/* Course Enrollments Section */}
            <div className="bg-white rounded border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Course Enrollments</h2>
                    <p className="text-gray-600 text-sm">View accepted students by course and date</p>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Department Filter Dropdown */}
                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded px-4 py-2">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <select
                      value={selectedDepartmentFilter}
                      onChange={(e) => {
                        setSelectedDepartmentFilter(e.target.value);
                        setSelectedCourseFilter('all'); // Reset course filter when department changes
                      }}
                      className="bg-transparent text-gray-900 border-none focus:ring-0 cursor-pointer min-w-[150px] [&>option]:text-gray-900"
                    >
                      <option value="all">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Course Filter Dropdown */}
                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded px-4 py-2">
                    <BookOpen className="w-5 h-5 text-gray-500" />
                    <select
                      value={selectedCourseFilter}
                      onChange={(e) => setSelectedCourseFilter(e.target.value)}
                      className="bg-transparent text-gray-900 border-none focus:ring-0 cursor-pointer min-w-[150px] [&>option]:text-gray-900"
                    >
                      <option value="all">All Courses</option>
                      {courses
                        .filter(course => {
                          // Filter courses by selected department
                          if (selectedDepartmentFilter === 'all') return true;
                          const courseDeptId = typeof course.department === 'object' ? course.department._id : course.department;
                          return courseDeptId === selectedDepartmentFilter;
                        })
                        .map(course => (
                          <option key={course._id} value={course.title}>
                            {course.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Date Range Filter Dropdown */}
                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded px-4 py-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <select
                      value={selectedDateFilter}
                      onChange={(e) => setSelectedDateFilter(e.target.value)}
                      className="bg-transparent text-gray-900 border-none focus:ring-0 cursor-pointer min-w-[150px] [&>option]:text-gray-900"
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
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Enrolled Courses</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Enrollment Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getAcceptedStudents().length > 0 ? (
                      getAcceptedStudents().map((app) => (
                        <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-900 font-medium">{app.firstName} {app.lastName}</td>
                          <td className="px-6 py-4 text-gray-600">{app.email}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                                {app.courses && app.courses.map(c => (
                                    <span key={c._id} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-green-50 text-green-700 border border-green-200 text-sm">
                                      <BookOpen className="w-3 h-3" />
                                      {c.title}
                                    </span>
                                ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-600">
                          No enrolled students found for the selected criteria.
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

