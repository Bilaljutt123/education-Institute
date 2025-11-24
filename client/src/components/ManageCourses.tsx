import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Course } from '@/types';
import { api, getCourses } from '@/utils/api';
import { BookOpen, Plus, Trash2, DollarSign, Clock } from 'lucide-react';

const ManageCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchCourses = async () => {
        try {
          const res = await getCourses();
          setCourses(res.data);
        } catch (err) {
          console.error('Could not fetch courses:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(course => course._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Could not delete course:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading courses...</p>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-200">
              Manage Courses
            </h1>
            <p className="text-xl text-purple-200">
              Create, view, and manage all course offerings
            </p>
          </div>
          <button
            onClick={() => navigate('/create-course')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Course
          </button>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300"
              >
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <button
                    onClick={() => setDeleteConfirm(course._id)}
                    className="p-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Course Info */}
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-purple-200 text-sm mb-4 line-clamp-2">{course.description}</p>

                {/* Course Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-purple-300">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-400 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>{course.tuition}</span>
                    </div>
                  </div>
                  {course.instructor && (
                    <p className="text-purple-300 text-xs">
                      Instructor: {course.instructor}
                    </p>
                  )}
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === course._id && (
                  <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                    <p className="text-red-200 text-sm mb-3">
                      Delete this course? This will also remove all <strong>students and applications</strong> associated with it.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 px-3 py-2 bg-white/10 text-purple-200 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-12 text-center">
            <div className="inline-flex p-6 rounded-full bg-purple-500/20 mb-4">
              <BookOpen className="w-12 h-12 text-purple-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              No courses available
            </h3>
            <p className="text-purple-200 mb-6">
              Get started by creating your first course
            </p>
            <button
              onClick={() => navigate('/create-course')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create First Course
            </button>
          </div>
        )}

        {/* Stats */}
        {courses.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-500/10 backdrop-blur-md border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-purple-200 text-sm">Total Courses</p>
                  <p className="text-white text-2xl font-bold">{courses.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-green-200 text-sm">Avg. Tuition</p>
                  <p className="text-white text-2xl font-bold">
                    ${Math.round(courses.reduce((sum, c) => sum + c.tuition, 0) / courses.length)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-cyan-200 text-sm">Active Programs</p>
                  <p className="text-white text-2xl font-bold">{courses.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;