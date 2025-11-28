import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/utils/api';
import { BookOpen, Clock, DollarSign, User, Calendar, ArrowLeft, Building2 } from 'lucide-react';
import type { Department } from '@/types';

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  tuition: number;
  instructor?: string;
  department?: Department | string;
  schedule?: {
    startDate: string;
    endDate: string;
  };
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          const res = await api.get<{ data: Course }>(`/courses/${id}`);
          setCourse(res.data.data);
        } catch (err) {
          console.error('Could not fetch course details:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-900 text-xl mb-4">Course not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Course Header */}
        <div className="bg-white rounded border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="inline-flex p-4 rounded bg-blue-600 mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </div>
            <div className="ml-6 px-6 py-3 bg-green-50 border border-green-200 rounded">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-700">{course.tuition}</span>
              </div>
              <p className="text-green-600 text-xs mt-1">Tuition Fee</p>
            </div>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Duration Card */}
          <div className="bg-white rounded border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded bg-blue-50">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Duration</p>
                <p className="text-gray-900 text-xl font-semibold">{course.duration}</p>
              </div>
            </div>
          </div>

          {/* Instructor Card */}
          {course.instructor && (
            <div className="bg-white rounded border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded bg-blue-50">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Instructor</p>
                  <p className="text-gray-900 text-xl font-semibold">{course.instructor}</p>
                </div>
              </div>
            </div>
          )}

          {/* Department Card */}
          {course.department && typeof course.department !== 'string' && (
            <div className="bg-white rounded border border-gray-200 p-6 md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded bg-blue-50">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Department</p>
                  <p className="text-gray-900 text-xl font-semibold">{course.department.name}</p>
                  <p className="text-gray-500 text-sm">{course.department.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Card */}
          {course.schedule && (
            <div className="bg-white rounded border border-gray-200 p-6 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded bg-blue-50">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-gray-900 text-lg font-semibold">Course Schedule</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded border border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">Start Date</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(course.schedule.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded border border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">End Date</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(course.schedule.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/apply')}
            className="px-8 py-4 bg-blue-600 text-white rounded font-semibold text-lg hover:bg-blue-700 transition-all duration-300 inline-flex items-center gap-2"
          >
            Apply for this Course
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;