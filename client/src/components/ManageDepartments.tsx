import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDepartments, deleteDepartment } from '@/utils/api';
import type { Department } from '@/types';
import { Building2, Plus, Trash2, Edit, Users } from 'lucide-react';

const ManageDepartments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
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
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDepartment(id);
      setDepartments(prev => prev.filter(dept => dept._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Could not delete department:', err);
    }
  };

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
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap">
          <div className="bg-white rounded border border-gray-200 p-6 flex-1 mr-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Manage Departments
            </h1>
            <p className="text-xl text-gray-600">
              Oversee academic departments and their details
            </p>
          </div >
          <button
            onClick={() => navigate('/create-department')}
            className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2 self-start mt-6"
          >
            <Plus className="w-5 h-5" />
            Add New Department
          </button>
        </div>

        {/* Departments Grid */}
        {departments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept._id}
                className="bg-white rounded border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all"
              >
                {/* Department Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded bg-blue-600">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex gap-2">
                    {/* Edit Button (Placeholder for now) */}
                    {/* <button
                      onClick={() => navigate(`/edit-department/${dept._id}`)}
                      className="p-2 rounded bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button> */}
                    <button
                      onClick={() => setDeleteConfirm(dept._id)}
                      className="p-2 rounded bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Department Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{dept.name}</h3>
                <p className="text-sm font-mono text-blue-600 mb-3">{dept.code}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dept.description}</p>

                {/* Department Details */}
                <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
                  {dept.head && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Head:</span>
                      <span>{dept.head}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span>Created: {new Date(dept.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === dept._id && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-700 text-sm mb-3">
                      Delete this department? This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(dept._id)}
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
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No departments found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first academic department
            </p>
            <button
              onClick={() => navigate('/create-department')}
              className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create First Department
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDepartments;
