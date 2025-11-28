import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDepartments, getCourses } from '@/utils/api';
import type { Department, Course } from '@/types';
import { Building2, BookOpen, Clock, DollarSign, GraduationCap, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const Services = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptsRes, coursesRes] = await Promise.all([
          getDepartments(),
          getCourses()
        ]);
        setDepartments(deptsRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCoursesByDepartment = (deptId: string) => {
    return courses.filter(course => {
      const courseDeptId = typeof course.department === 'object' ? course.department._id : course.department;
      return courseDeptId === deptId;
    });
  };

  const toggleDepartment = (deptId: string) => {
    setExpandedDept(expandedDept === deptId ? null : deptId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading our academic programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-6 h-6" />
            <span className="text-blue-100 font-medium">Academic Excellence</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our Academic Programs
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Explore our comprehensive range of departments and courses designed to help you achieve your educational and career goals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm hover:shadow-md transition-all">
            <div className="inline-flex p-4 rounded-full bg-blue-50 mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">{departments.length}</h3>
            <p className="text-gray-600 font-medium">Academic Departments</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm hover:shadow-md transition-all">
            <div className="inline-flex p-4 rounded-full bg-green-50 mb-4">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">{courses.length}</h3>
            <p className="text-gray-600 font-medium">Courses Available</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm hover:shadow-md transition-all">
            <div className="inline-flex p-4 rounded-full bg-purple-50 mb-4">
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">Expert</h3>
            <p className="text-gray-600 font-medium">Faculty Members</p>
          </div>
        </div>

        {/* Departments List */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Explore Our Departments</h2>
          
          {departments.length > 0 ? (
            <div className="space-y-6">
              {departments.map((dept) => {
                const deptCourses = getCoursesByDepartment(dept._id);
                const isExpanded = expandedDept === dept._id;
                
                return (
                  <div 
                    key={dept._id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all"
                  >
                    {/* Department Header */}
                    <div 
                      className="p-8 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleDepartment(dept._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-blue-50">
                              <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{dept.name}</h3>
                              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded mt-2">
                                Code: {dept.code}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-lg mb-4">{dept.description}</p>
                          
                          {dept.head && (
                            <div className="text-sm text-gray-500">
                              <span className="font-semibold text-gray-700">Head of Department:</span> {dept.head}
                            </div>
                          )}
                          
                          <div className="mt-4 flex items-center gap-2 text-blue-600 font-medium">
                            <BookOpen className="w-4 h-4" />
                            <span>{deptCourses.length} Course{deptCourses.length !== 1 ? 's' : ''} Available</span>
                          </div>
                        </div>
                        
                        <button 
                          className="ml-4 p-2 rounded-full hover:bg-blue-50 transition-colors"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-6 h-6 text-blue-600" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-blue-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Courses List (Expandable) */}
                    {isExpanded && deptCourses.length > 0 && (
                      <div className="border-t border-gray-200 bg-gray-50 p-8">
                        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          Courses in {dept.name}
                        </h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {deptCourses.map(course => (
                            <div 
                              key={course._id}
                              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all"
                            >
                              <h5 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h5>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-600 font-semibold">
                                  <DollarSign className="w-4 h-4" />
                                  <span>{course.tuition}</span>
                                </div>
                              </div>
                              
                              {course.instructor && (
                                <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                                  <span className="font-semibold">Instructor:</span> {course.instructor}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No departments available at the moment.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <div className="inline-flex p-4 rounded-full bg-white/10 mb-6">
            <GraduationCap className="w-12 h-12" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of learners and take the first step towards achieving your academic and career goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center justify-center gap-2 shadow-lg"
            >
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/"
              className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all border-2 border-white/30"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
