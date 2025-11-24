import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourses } from '@/utils/api';
import type { Course } from '@/types';
import { 
  BookOpen, 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  CheckSquare,
  Download,
  Video,
  Users
} from 'lucide-react';

const MyCourse = () => {
  const { courseTitle } = useParams<{ courseTitle: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'materials' | 'assignments' | 'attendance'>('materials');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await getCourses();
        const foundCourse = res.data.find(c => c.title === decodeURIComponent(courseTitle || ''));
        setCourse(foundCourse || null);
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseTitle]);

  // Mock data - In production, fetch from backend
  const courseMaterials = [
    { id: 1, title: 'Week 1: Introduction to Course', type: 'PDF', size: '2.5 MB', uploadDate: '2024-01-01' },
    { id: 2, title: 'Week 2: Core Concepts', type: 'Video', size: '150 MB', uploadDate: '2024-01-08' },
    { id: 3, title: 'Week 3: Practical Examples', type: 'PDF', size: '3.1 MB', uploadDate: '2024-01-15' },
    { id: 4, title: 'Supplementary Reading', type: 'Document', size: '1.8 MB', uploadDate: '2024-01-10' },
  ];

  const assignments = [
    { id: 1, title: 'Assignment 1: Basics', dueDate: '2024-02-01', status: 'submitted', grade: '95/100' },
    { id: 2, title: 'Assignment 2: Intermediate', dueDate: '2024-02-15', status: 'submitted', grade: '88/100' },
    { id: 3, title: 'Assignment 3: Advanced', dueDate: '2024-03-01', status: 'pending', grade: null },
    { id: 4, title: 'Final Project', dueDate: '2024-03-20', status: 'not-started', grade: null },
  ];

  const attendanceRecords = [
    { id: 1, date: '2024-01-05', status: 'present' },
    { id: 2, date: '2024-01-12', status: 'present' },
    { id: 3, date: '2024-01-19', status: 'absent' },
    { id: 4, date: '2024-01-26', status: 'present' },
    { id: 5, date: '2024-02-02', status: 'present' },
    { id: 6, date: '2024-02-09', status: 'present' },
  ];

  const attendanceRate = Math.round((attendanceRecords.filter(r => r.status === 'present').length / attendanceRecords.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Course not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 rounded-lg hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Course Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-purple-200 mb-6">{course.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {course.instructor && (
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <User className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-purple-300 text-xs">Instructor</p>
                      <p className="text-white font-semibold">{course.instructor}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-purple-300 text-xs">Duration</p>
                    <p className="text-white font-semibold">{course.duration}</p>
                  </div>
                </div>
                {course.schedule && (
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <Calendar className="w-5 h-5 text-pink-400" />
                    <div>
                      <p className="text-purple-300 text-xs">Schedule</p>
                      <p className="text-white font-semibold text-sm">
                        {new Date(course.schedule.startDate).toLocaleDateString()} - {new Date(course.schedule.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'materials'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-purple-200 hover:bg-white/10'
            }`}
          >
            <FileText className="w-5 h-5 inline-block mr-2" />
            Course Materials
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'assignments'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-purple-200 hover:bg-white/10'
            }`}
          >
            <CheckSquare className="w-5 h-5 inline-block mr-2" />
            Assignments
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'attendance'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-purple-200 hover:bg-white/10'
            }`}
          >
            <Users className="w-5 h-5 inline-block mr-2" />
            Attendance
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
          {/* Course Materials Tab */}
          {activeTab === 'materials' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Course Materials</h2>
              <div className="space-y-4">
                {courseMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-500/20">
                          {material.type === 'Video' ? (
                            <Video className="w-6 h-6 text-purple-400" />
                          ) : (
                            <FileText className="w-6 h-6 text-purple-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{material.title}</h3>
                          <p className="text-purple-300 text-sm">
                            {material.type} • {material.size} • Uploaded: {new Date(material.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Assignments</h2>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-6 bg-white/5 border border-white/10 rounded-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-2">{assignment.title}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-purple-300">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            assignment.status === 'submitted' 
                              ? 'bg-green-500/20 text-green-200 border border-green-500/50'
                              : assignment.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/50'
                              : 'bg-gray-500/20 text-gray-200 border border-gray-500/50'
                          }`}>
                            {assignment.status.toUpperCase().replace('-', ' ')}
                          </div>
                        </div>
                        {assignment.grade && (
                          <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg inline-block">
                            <p className="text-green-200 font-semibold">Grade: {assignment.grade}</p>
                          </div>
                        )}
                      </div>
                      {assignment.status !== 'submitted' && (
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all">
                          Submit Assignment
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Attendance Record</h2>
                <div className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-green-500/30">
                      <Users className="w-8 h-8 text-green-300" />
                    </div>
                    <div>
                      <p className="text-green-200 text-sm">Overall Attendance Rate</p>
                      <p className="text-white text-3xl font-bold">{attendanceRate}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendanceRecords.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 rounded-xl border ${
                      record.status === 'present'
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={record.status === 'present' ? 'text-green-200' : 'text-red-200'}>
                          {new Date(record.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'present'
                          ? 'bg-green-500/30 text-green-200'
                          : 'bg-red-500/30 text-red-200'
                      }`}>
                        {record.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourse;
