import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDepartments } from '@/utils/api';
import type { Department } from '@/types';
import { Building2, ArrowRight } from 'lucide-react';

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getDepartments();
        setDepartments(res.data);
      } catch (err) {
        console.error('Could not fetch departments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Academic Departments</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of academic departments and find the program that fits your career goals.
          </p>
        </div>

        {departments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <div
                key={dept._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/departments/${dept._id}`)}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                    <Building2 className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{dept.name}</h3>
                  <div className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded mb-4">
                    {dept.code}
                  </div>
                  <p className="text-gray-600 line-clamp-3 mb-6">
                    {dept.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    View Programs <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No departments found
            </h3>
            <p className="text-gray-600">
              Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentList;
