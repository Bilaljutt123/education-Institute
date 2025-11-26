import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Filter, Trash2, Eye } from 'lucide-react';
import { getApplicationsWithDetails, updateApplicationStatus, deleteApplication } from '@/utils/api';
import type { ApplicationWithDetails } from '@/types';
import StudentProfileModal from './StudentProfileModal';

type FilterStatus = 'pending' | 'accepted' | 'rejected';

const ApplicationsTable = () => {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('pending');
  const [selectedStudent, setSelectedStudent] = useState<ApplicationWithDetails | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    const filtered = applications.filter(app => app.status === activeFilter);
    setFilteredApplications(filtered);
  }, [applications, activeFilter]);

  const fetchApplications = async () => {
    try {
      const response = await getApplicationsWithDetails();
      setApplications(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to fetch applications');
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      await updateApplicationStatus(id, { status });
      setApplications(applications.map(app => 
        app._id === id ? { ...app, status } : app
      ));
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      await deleteApplication(id);
      setApplications(applications.filter(app => app._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to delete application');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/50',
      accepted: 'bg-green-500/20 text-green-200 border-green-500/50',
      rejected: 'bg-red-500/20 text-red-200 border-red-500/50',
    };

    const icons = {
      pending: <Clock className="w-4 h-4" />,
      accepted: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
    };

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${styles[status as keyof typeof styles]} font-medium text-sm`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getFilterButtonClass = (filter: FilterStatus) => {
    const baseClass = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 inline-flex items-center gap-2";
    
    if (activeFilter === filter) {
      const activeStyles = {
        pending: 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-yellow-500/50',
        accepted: 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/50',
        rejected: 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/50',
      };
      return `${baseClass} ${activeStyles[filter]}`;
    }
    
    return `${baseClass} bg-white/10 backdrop-blur-md border border-white/20 text-purple-100 hover:bg-white/20`;
  };

  const getCount = (status: FilterStatus) => {
    return applications.filter(app => app.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-200">
            Manage Applications
          </h1>
          <p className="text-xl text-purple-200">Review and manage student applications</p>
        </div>

        <div className="mb-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-6 h-6 text-purple-300" />
            <h2 className="text-xl font-semibold text-white">Filter by Status</h2>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setActiveFilter('pending')} className={getFilterButtonClass('pending')}>
              <Clock className="w-5 h-5" />
              Pending
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">{getCount('pending')}</span>
            </button>

            <button onClick={() => setActiveFilter('accepted')} className={getFilterButtonClass('accepted')}>
              <CheckCircle className="w-5 h-5" />
              Accepted
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">{getCount('accepted')}</span>
            </button>

            <button onClick={() => setActiveFilter('rejected')} className={getFilterButtonClass('rejected')}>
              <XCircle className="w-5 h-5" />
              Rejected
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">{getCount('rejected')}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-xl p-4">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex p-6 rounded-full bg-purple-500/20 mb-4">
                <Filter className="w-12 h-12 text-purple-300" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">No {activeFilter} applications</h3>
              <p className="text-purple-200">There are currently no {activeFilter} applications to display.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Applied On</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredApplications.map((application) => (
                    <tr key={application._id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4 text-white font-medium">{application.firstName} {application.lastName}</td>
                      <td className="px-6 py-4 text-purple-200">{application.email}</td>
                      <td className="px-6 py-4 text-purple-200">{application.desiredCourse || application.course?.title || 'N/A'}</td>
                      <td className="px-6 py-4">{getStatusBadge(application.status)}</td>
                      <td className="px-6 py-4 text-purple-200">
                        {new Date(application.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {/* View Profile Button */}
                          <button
                            onClick={() => setSelectedStudent(application)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                            title="View Student Profile"
                          >
                            <Eye className="w-4 h-4" />
                            Profile
                          </button>

                          {application.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(application._id, 'accepted')}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => updateStatus(application._id, 'rejected')}
                                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(application._id)}
                            className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-gray-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                            title="Delete Application"
                          >
                            <Trash2 className="w-4 h-4" />
                            {application.status !== 'pending' && 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-yellow-200 text-sm">Pending</p>
                <p className="text-white text-2xl font-bold">{getCount('pending')}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-green-200 text-sm">Accepted</p>
                <p className="text-white text-2xl font-bold">{getCount('accepted')}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-red-200 text-sm">Rejected</p>
                <p className="text-white text-2xl font-bold">{getCount('rejected')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile Modal */}
      <StudentProfileModal 
        application={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};

export default ApplicationsTable;