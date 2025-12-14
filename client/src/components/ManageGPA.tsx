import { useState, useEffect } from 'react';
import { getApplicationsWithDetails, getDepartments, addOrUpdateGPA, getStudentGPA } from '@/utils/api';
import type { ApplicationWithDetails, Department, GPA } from '@/types';
import { Building2, User, GraduationCap, Save, Search, AlertCircle, CheckCircle } from 'lucide-react';

const ManageGPA = () => {
  const [students, setStudents] = useState<ApplicationWithDetails[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [studentGPAs, setStudentGPAs] = useState<GPA[]>([]);
  
  // Form state
  const [semester, setSemester] = useState<number>(1);
  const [gpa, setGpa] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, deptsRes] = await Promise.all([
          getApplicationsWithDetails(),
          getDepartments()
        ]);
        
        // Filter only accepted students and deduplicate by student ID
        const acceptedApps = appsRes.data.filter(app => app.status === 'accepted');
        
        const uniqueStudentsMap = new Map();
        acceptedApps.forEach(app => {
            if (app.student && typeof app.student === 'object' && !uniqueStudentsMap.has(app.student._id)) {
                uniqueStudentsMap.set(app.student._id, app);
            }
        });
        
        setStudents(Array.from(uniqueStudentsMap.values()));
        setDepartments(deptsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStudentSelect = async (studentId: string, departmentId: string) => {
    setSelectedStudent(studentId);
    setMessage(null);
    setGpa('');
    setSemester(1);
    
    try {
      const res = await getStudentGPA(studentId);
      setStudentGPAs(res.data);
    } catch (err) {
      console.error('Error fetching student GPAs:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    // Find the student's department from their application
    const studentApp = students.find(s => s.student?._id === selectedStudent);
    if (!studentApp || !studentApp.department) {
        setMessage({ type: 'error', text: 'Student department not found' });
        return;
    }

    const deptId = studentApp.department._id;

    setSubmitLoading(true);
    setMessage(null);

    try {
      await addOrUpdateGPA({
        studentId: selectedStudent,
        departmentId: deptId,
        semester,
        gpa: parseFloat(gpa)
      });

      setMessage({ type: 'success', text: 'GPA updated successfully' });
      
      // Refresh GPA list
      const res = await getStudentGPA(selectedStudent);
      setStudentGPAs(res.data);
      
      // Reset form slightly
      setGpa('');
    } catch (err: any) {
      console.error('Error updating GPA:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update GPA' });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Filter students based on selected department
  const filteredStudents = students.filter(student => {
    if (selectedDepartment === 'all') return true;
    if (!student.department) return false;
    return student.department._id === selectedDepartment;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Student GPA</h1>
          <p className="text-gray-600">Assign and update GPA records for enrolled students.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Student List */}
          <div className="lg:col-span-1 bg-white rounded border border-gray-200 p-6 h-fit">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Department</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {loading ? (
                <div className="text-center py-4">Loading students...</div>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((app) => (
                  <button
                    key={app._id}
                    onClick={() => {
                      if (app.student && app.department) {
                        handleStudentSelect(app.student._id, app.department._id);
                      }
                    }}
                    className={`w-full text-left p-3 rounded border transition-all ${
                      selectedStudent === app.student?._id
                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{app.firstName} {app.lastName}</div>
                    <div className="text-sm text-gray-500 truncate">{app.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {typeof app.department === 'object' ? app.department.name : 'Unknown Dept'}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No students found.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: GPA Management */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="space-y-6">
                {/* Add/Update GPA Form */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    Update GPA Record
                  </h2>

                  {message && (
                    <div className={`p-4 rounded mb-6 flex items-center gap-2 ${
                      message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      {message.text}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>Semester {num}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GPA (0.0 - 4.0)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        value={gpa}
                        onChange={(e) => setGpa(e.target.value)}
                        placeholder="e.g. 3.5"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {submitLoading ? 'Saving...' : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Record
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Existing GPA Records */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Academic History</h3>
                    {studentGPAs.length > 0 && (
                      <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                        <span className="text-sm text-blue-700 font-medium mr-2">Cumulative GPA (CGPA):</span>
                        <span className="text-xl font-bold text-blue-800">
                          {(studentGPAs.reduce((acc, curr) => acc + curr.gpa, 0) / studentGPAs.length).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {studentGPAs.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Semester</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">GPA</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {studentGPAs.map((record) => (
                            <tr key={record._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-900 font-medium">Semester {record.semester}</td>
                              <td className="px-4 py-3 text-gray-600">
                                {typeof record.department === 'object' ? record.department.name : 'Unknown'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  record.gpa >= 3.5 ? 'bg-green-100 text-green-800' :
                                  record.gpa >= 3.0 ? 'bg-blue-100 text-blue-800' :
                                  record.gpa >= 2.0 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {record.gpa.toFixed(2)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-500 text-sm">
                                {new Date(record.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded border border-dashed border-gray-300">
                      No GPA records found for this student.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Student</h3>
                <p className="text-gray-500">
                  Select a student from the list to view and manage their GPA records.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGPA;
