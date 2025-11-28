import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, getDepartment } from '@/utils/api';
import type { Department, Course } from '@/types';
import { Building2, BookOpen, Clock, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';

const DepartmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const deptRes = await getDepartment(id);
          setDepartment(deptRes.data);

          // Fetch courses for this department
          const coursesRes = await api.get<{ data: Course[] }>(`/courses?department=${id}`);
          setCourses(coursesRes.data.data);
        } catch (err) {
          console.error('Could not fetch department details:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading department details...</p>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-900 text-xl mb-4">Department not found</p>
          <button
            onClick={() => navigate('/departments')}
            className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/departments')}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Departments
        </button>

        {/* Department Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-blue-100 rounded-xl">
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{department.name}</h1>
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded mb-4">
                Code: {department.code}
              </div>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {department.description}
              </p>
              {department.head && (
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">Head of Department:</span> {department.head}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate(`/apply?department=${department._id}`)}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Apply Now <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Available Programs & Courses
        </h2>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-green-600">
                    <DollarSign className="w-4 h-4" />
                    {course.tuition}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-lg">No courses currently available in this department.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDetail;
