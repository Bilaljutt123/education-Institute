import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDepartments, getCourses } from '@/utils/api';
import type { Department, Course } from '@/types';
import { Building2, BookOpen, Clock, DollarSign, GraduationCap, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Carousel from './Carousel';

const Services = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  const slides = [
    {
      image: '/images/hero_lecture_hall_1765725170900.png',
      title: 'Our Academic Programs',
      description: 'Explore our comprehensive range of departments and courses designed to help you achieve your educational and career goals.',
      ctaText: 'Browse Departments',
      ctaLink: '#departments'
    },
    {
      image: '/images/dept_computer_science_1765725187474.png',
      title: 'Cutting-Edge Technology',
      description: 'Master the latest technologies in our state-of-the-art computer science laboratories.',
    },
    {
      image: '/images/dept_arts_1765725227367.png',
      title: 'Creative Excellence',
      description: 'Unleash your creativity in our modern art studios and design workshops.',
    }
  ];

  // Mapping department codes to images
  const getDepartmentImage = (code: string) => {
    const images: Record<string, string> = {
      'CS': '/images/dept_computer_science_1765725187474.png',
      'BUS': '/images/dept_business_1765725208181.png',
      'ARTS': '/images/dept_arts_1765725227367.png',
      'ENG': '/images/hero_lecture_hall_1765725170900.png',
      'SCI': '/images/hero_library_study_1765725147090.png'
    };
    return images[code] || '/images/hero_campus_modern_1765725127334.png';
  };

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
      const courseDeptId = (course.department && typeof course.department === 'object') ? course.department._id : course.department;
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
      {/* Hero Carousel */}
      <Carousel slides={slides} />

      <div className="max-w-7xl mx-auto px-6 py-16" id="departments">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 relative -mt-32 z-10">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-xl hover:shadow-2xl transition-all">
            <div className="inline-flex p-4 rounded-full bg-blue-50 mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">{departments.length}</h3>
            <p className="text-gray-600 font-medium">Academic Departments</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-xl hover:shadow-2xl transition-all">
            <div className="inline-flex p-4 rounded-full bg-green-50 mb-4">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">{courses.length}</h3>
            <p className="text-gray-600 font-medium">Courses Available</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-xl hover:shadow-2xl transition-all">
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
            <div className="space-y-8">
              {departments.map((dept) => {
                const deptCourses = getCoursesByDepartment(dept._id);
                const isExpanded = expandedDept === dept._id;
                const deptImage = getDepartmentImage(dept.code);
                
                return (
                  <div 
                    key={dept._id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Department Image */}
                      <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                        <img 
                          src={deptImage} 
                          alt={dept.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
                        <div className="absolute bottom-4 left-4 text-white md:hidden">
                          <h3 className="text-xl font-bold">{dept.name}</h3>
                        </div>
                      </div>

                      {/* Department Content */}
                      <div className="flex-1 flex flex-col">
                        <div 
                          className="p-8 cursor-pointer hover:bg-gray-50 transition-colors flex-1"
                          onClick={() => toggleDepartment(dept._id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="hidden md:block p-3 rounded-lg bg-blue-50">
                                  <Building2 className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="hidden md:block text-2xl font-bold text-gray-900">{dept.name}</h3>
                                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded mt-2 md:mt-0">
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
                              className="ml-4 p-2 rounded-full hover:bg-blue-50 transition-colors self-start"
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
                            <div className="grid md:grid-cols-2 gap-6">
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
                    </div>
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/hero_campus_modern_1765725127334.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10">
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
    </div>
  );
};

export default Services;
