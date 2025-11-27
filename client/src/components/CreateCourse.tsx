import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/utils/api';
import { Plus, ArrowLeft } from 'lucide-react';

interface CourseFormData {
  title: string;
  description: string;
  duration: string;
  tuition: number;
  instructor: string;
  schedule: {
    startDate: string;
    endDate: string;
  };
}

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    duration: '',
    tuition: 0,
    instructor: '',
    schedule: {
      startDate: '',
      endDate: '',
    },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { title, description, duration, tuition, instructor } = formData;
  const { startDate, endDate } = formData.schedule;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'startDate' || name === 'endDate') {
      setFormData({
        ...formData,
        schedule: {
          ...formData.schedule,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/courses', formData);
      navigate('/manage-courses');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/manage-courses')}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </button>

        {/* Header */}
        <div className="mb-8 bg-white rounded border border-gray-200 p-6">
          <div className="inline-flex p-4 rounded bg-blue-600 mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create New Course
          </h1>
          <p className="text-xl text-gray-600">
            Fill out the form below to add a new course to the institution
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded border border-gray-200 p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Course Title</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                required
                placeholder="e.g. Web Development Bootcamp"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Course Description</label>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                required
                rows={4}
                placeholder="Describe the course curriculum and objectives..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Duration and Tuition Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={duration}
                  onChange={onChange}
                  required
                  placeholder="e.g. 3 Months"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tuition ($)</label>
                <input
                  type="number"
                  name="tuition"
                  value={tuition}
                  onChange={onChange}
                  required
                  placeholder="0"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Instructor */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Instructor (Optional)</label>
              <input
                type="text"
                name="instructor"
                value={instructor}
                onChange={onChange}
                placeholder="e.g. Dr. Jane Smith"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={startDate}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={endDate}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded font-semibold text-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Course...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Course
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;