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
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      accepted: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
    };

    const icons = {
      pending: <Clock className="w-4 h-4" />,
      accepted: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
    };

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded border ${styles[status as keyof typeof styles]} font-medium text-sm`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getFilterButtonClass = (filter: FilterStatus) => {
    const baseClass = "px-6 py-3 rounded font-semibold transition-all inline-flex items-center gap-2";
    
    if (activeFilter === filter) {
      const activeStyles = {
        pending: 'bg-yellow-600 text-white',
        accepted: 'bg-green-600 text-white',
        rejected: 'bg-red-600 text-white',
      };
      return `${baseClass} ${activeStyles[filter]}`;
    }
    
    return `${baseClass} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`;
  };

  const getCount = (status: FilterStatus) => {
    return applications.filter(app => app.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-white rounded border border-gray-200 p-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Manage Applications
          </h1>
          <p className="text-xl text-gray-600">Review and manage student applications</p>
        </div>

        <div className="mb-8 bg-white rounded border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Filter by Status</h2>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setActiveFilter('pending')} className={getFilterButtonClass('pending')}>
              <Clock className="w-5 h-5" />
              Pending
              <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs">{getCount('pending')}</span>
            </button>

            <button onClick={() => setActiveFilter('accepted')} className={getFilterButtonClass('accepted')}>
              <CheckCircle className="w-5 h-5" />
              Accepted
              <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs">{getCount('accepted')}</span>
            </button>

            <button onClick={() => setActiveFilter('rejected')} className={getFilterButtonClass('rejected')}>
              <XCircle className="w-5 h-5" />
              Rejected
              <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs">{getCount('rejected')}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
                <Filter className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No {activeFilter} applications</h3>
              <p className="text-gray-600">There are currently no {activeFilter} applications to display.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Applied Courses</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.values(
                    filteredApplications.reduce((acc, app) => {
                      const studentId = typeof app.student === 'object' ? app.student._id : app.student;
                      if (!acc[studentId]) {
                        acc[studentId] = {
                          student: app.student,
                          firstName: app.firstName,
                          lastName: app.lastName,
                          email: app.email,
                          applications: []
                        };
                      }
                      acc[studentId].applications.push(app);
                      return acc;
                    }, {} as Record<string, { student: any, firstName: string, lastName: string, email: string, applications: ApplicationWithDetails[] }>)
                  ).map((studentGroup) => (
                    <tr key={typeof studentGroup.student === 'object' ? studentGroup.student._id : Math.random()} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900 font-medium">{studentGroup.firstName} {studentGroup.lastName}</td>
                      <td className="px-6 py-4 text-gray-600">{studentGroup.email}</td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {studentGroup.applications.map(app => (
                            <div key={app._id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                              <span className="text-sm font-medium text-gray-700">
                                {app.courses && app.courses.length > 0 ? app.courses[0].title : 'Unknown Course'}
                              </span>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(app.status)}
                                {app.status === 'pending' && (
                                  <div className="flex gap-1">
                                    <button 
                                      onClick={() => updateStatus(app._id, 'accepted')}
                                      className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                      title="Accept Course"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => updateStatus(app._id, 'rejected')}
                                      className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                      title="Reject Course"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                                <button
                                  onClick={() => handleDelete(app._id)}
                                  className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                                  title="Delete Application"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setSelectedStudent(studentGroup.applications[0])}
                            className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-all inline-flex items-center gap-2 justify-center"
                          >
                            <Eye className="w-4 h-4" />
                            View Profile
                          </button>
                          
                          {studentGroup.applications.some(app => app.status === 'pending') && (
                            <>
                              <button
                                onClick={() => {
                                  if(window.confirm(`Accept all ${studentGroup.applications.filter(a => a.status === 'pending').length} pending applications for this student?`)) {
                                    studentGroup.applications
                                      .filter(a => a.status === 'pending')
                                      .forEach(a => updateStatus(a._id, 'accepted'));
                                  }
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-all inline-flex items-center gap-2 justify-center"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Accept All
                              </button>
                              <button
                                onClick={() => {
                                   if(window.confirm(`Reject all ${studentGroup.applications.filter(a => a.status === 'pending').length} pending applications for this student?`)) {
                                    studentGroup.applications
                                      .filter(a => a.status === 'pending')
                                      .forEach(a => updateStatus(a._id, 'rejected'));
                                  }
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-all inline-flex items-center gap-2 justify-center"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject All
                              </button>
                            </>
                          )}
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
          <div className="bg-yellow-50 border border-yellow-200 rounded p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-yellow-700 text-sm">Pending</p>
                <p className="text-yellow-900 text-2xl font-bold">{getCount('pending')}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-green-700 text-sm">Accepted</p>
                <p className="text-green-900 text-2xl font-bold">{getCount('accepted')}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded p-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-red-700 text-sm">Rejected</p>
                <p className="text-red-900 text-2xl font-bold">{getCount('rejected')}</p>
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