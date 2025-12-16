
import { useState, useEffect } from 'react';
import { getAllRequests, updateRequestStatus } from '@/utils/api';
import { CheckCircle, XCircle, Clock, Filter, User } from 'lucide-react';

interface Request {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
  };
  type: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  startDate?: string;
  endDate?: string;
}

const ManageRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await getAllRequests();
      setRequests(res as any);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateRequestStatus(id, status);
      // Optimistic update
      setRequests(requests.map(req => 
        req._id === id ? { ...req, status: status as any } : req
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  return (
    <div className="bg-white rounded border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
            <h2 className="text-xl font-semibold text-gray-900">Student Requests</h2>
            <p className="text-sm text-gray-500">Manage leave applications and other student requests</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded border border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded ${filter === 'all' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 text-xs font-medium rounded ${filter === 'pending' ? 'bg-white shadow text-yellow-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1 text-xs font-medium rounded ${filter === 'approved' ? 'bg-white shadow text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Approved
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-4">
            {filteredRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded border border-dashed border-gray-200">
                    No requests found matching filters.
                </div>
            ) : (
                filteredRequests.map((req) => (
                <div key={req._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
                                    req.type === 'Sick Leave' ? 'bg-red-50 text-red-700 border-red-100' :
                                    req.type === 'Urgent Leave' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                    'bg-gray-100 text-gray-700 border-gray-200'
                                }`}>
                                    {req.type}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 mb-1">{req.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{req.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                                <div className="flex items-center gap-2">
                                    <User size={14} />
                                    <span className="font-medium text-gray-700">{req.student?.name}</span>
                                    <span className="text-xs text-gray-400">({req.student?.email})</span>
                                </div>
                                {req.startDate && (
                                    <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                                        <Clock size={14} />
                                        <span>{new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate!).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
                            {req.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleUpdateStatus(req._id, 'approved')}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors w-full md:w-auto justify-center"
                                    >
                                        <CheckCircle size={14} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(req._id, 'rejected')}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-white text-red-600 border border-red-200 rounded text-xs hover:bg-red-50 transition-colors w-full md:w-auto justify-center"
                                    >
                                        <XCircle size={14} /> Reject
                                    </button>
                                </>
                            )}
                            {req.status !== 'pending' && (
                                <span className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium ${
                                    req.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                    {req.status === 'approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                ))
            )}
        </div>
      )}
    </div>
  );
};

export default ManageRequests;
