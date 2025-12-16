
import { useState, useEffect } from 'react';
import { getMyRequests, createRequest } from '@/utils/api';
import { Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Request {
  _id: string;
  type: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  startDate?: string;
  endDate?: string;
}

const StudentRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Sick Leave',
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await getMyRequests();
      // Adjust if response is wrapped in data
      // Based on api.ts it returns response.data which might be T or ApiResponse<T>
      // The backend returns the array directly. 
      // api.ts wrapper expects { success, data } usually but here the backend returns plain array.
      // Wait, let's check backend. Backend returns res.json(requests) which is array.
      // But api.ts says return response.data.
      // So if backend returns array, response.data IS the array.
      // However ApiResponse<T> interface implies {data: T}. 
      // This might be a type mismatch but at runtime:
      // axios response.data = [ ... ]
      // api.ts returns [ ... ]
      // So we can use it directly?
      setRequests(res as any);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createRequest(formData);
      setShowForm(false);
      setFormData({ type: 'Sick Leave', title: '', description: '', startDate: '', endDate: '' });
      loadRequests();
    } catch (error) {
      console.error('Error creating request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">My Requests & Applications</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          <Plus size={16} />
          New Request
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-gray-50 p-6 rounded border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Submit New Request</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                >
                  <option>Sick Leave</option>
                  <option>Urgent Leave</option>
                  <option>Complaint</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  placeholder="Brief subject"
                />
              </div>
            </div>

            {formData.type.includes('Leave') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                placeholder="Detailed explanation..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {requests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No requests submitted yet.</p>
        ) : (
            requests.map((req) => (
            <div key={req._id} className="border border-gray-200 rounded p-4 flex flex-col md:flex-row justify-between gap-4">
                <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{req.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                    {req.type}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                <div className="text-xs text-gray-500">
                    Submitted on {new Date(req.createdAt).toLocaleDateString()}
                    {req.startDate && (
                    <span className="ml-2">
                        • {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate!).toLocaleDateString()}
                    </span>
                    )}
                </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                {req.status === 'approved' && (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded">
                    <CheckCircle size={14} /> Approved
                    </span>
                )}
                {req.status === 'rejected' && (
                    <span className="flex items-center gap-1 text-red-600 text-sm font-medium bg-red-50 px-2 py-1 rounded">
                    <XCircle size={14} /> Rejected
                    </span>
                )}
                {req.status === 'pending' && (
                    <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium bg-yellow-50 px-2 py-1 rounded">
                    <Clock size={14} /> Pending
                    </span>
                )}
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default StudentRequests;
