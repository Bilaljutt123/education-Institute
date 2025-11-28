import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Course } from '@/types';
import { api, getCourses } from '@/utils/api';
import { BookOpen, Plus, Trash2, DollarSign, Clock, Building2 } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="bg-white rounded border border-gray-200 p-6 flex-1 mr-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Manage Courses
            </h1>
            <p className="text-xl text-gray-600">
              Create, view, and manage all course offerings
            </p>
          </div>
          <button
            onClick={() => navigate('/create-course')}
            className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2 self-start mt-6"
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
                className="bg-white rounded border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all"
              >
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded bg-blue-600">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <button
                    onClick={() => setDeleteConfirm(course._id)}
                    className="p-2 rounded bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Course Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                {/* Course Details */}
                <div className="space-y-2 mb-4">
                  {/* Department Badge */}
                  {course.department && typeof course.department !== 'string' && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100 mb-2">
                      <Building2 className="w-3 h-3" />
                      {course.department.name}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>{course.tuition}</span>
                    </div>
                  </div>
                  {course.instructor && (
                    <p className="text-gray-600 text-xs">
                      Instructor: {course.instructor}
                    </p>
                  )}
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === course._id && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-700 text-sm mb-3">
                      Delete this course? This will also remove all <strong>students and applications</strong> associated with it.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
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
          <div className="bg-white rounded border border-gray-200 p-12 text-center">
            <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No courses available
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first course
            </p>
            <button
              onClick={() => navigate('/create-course')}
              className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create First Course
            </button>
          </div>
        )}

        {/* Stats */}
        {courses.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-blue-700 text-sm">Total Courses</p>
                  <p className="text-blue-900 text-2xl font-bold">{courses.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-green-700 text-sm">Avg. Tuition</p>
                  <p className="text-green-900 text-2xl font-bold">
                    ${Math.round(courses.reduce((sum, c) => sum + c.tuition, 0) / courses.length)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 border border-gray-200 rounded p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-gray-600" />
                <div>
                  <p className="text-gray-700 text-sm">Active Programs</p>
                  <p className="text-gray-900 text-2xl font-bold">{courses.length}</p>
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