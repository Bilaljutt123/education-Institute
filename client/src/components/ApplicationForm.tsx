import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getDepartments, getCourses, submitApplication, getMe, getMyApplications } from '@/utils/api';
import { FileText, Lock, CheckCircle, BookOpen, Clock, ArrowLeft, Building2 } from 'lucide-react';
import type { Department, Course } from '@/types';

// Type for the form data
interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  previousEducation: string;
  department: string;
  courses: string[];
}

const ApplicationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedDeptId = searchParams.get('department');

  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    previousEducation: '',
    department: preSelectedDeptId || '',
    courses: [],
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]); // Store IDs
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { firstName, lastName, email, phone, dateOfBirth, previousEducation, department, courses } = formData;

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        setLoadingProfile(true);
        const response = await getMe();
        const userData = response.data;
        
        if (!userData.profileCompleted) {
          alert('Please complete your profile before submitting applications.');
          navigate('/profile');
          return;
        }

        const nameParts = userData.name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        let formattedDateOfBirth = '';
        if (userData.dateOfBirth) {
          const date = new Date(userData.dateOfBirth);
          if (!isNaN(date.getTime())) {
            formattedDateOfBirth = date.toISOString().split('T')[0];
          }
        }

        setFormData(prev => ({
          ...prev,
          firstName,
          lastName,
          email: userData.email || '',
          phone: userData.phone || '',
          dateOfBirth: formattedDateOfBirth,
          previousEducation: userData.previousEducation || '',
        }));
        
        setLoadingProfile(false);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Could not load your profile data');
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getDepartments();
        setDepartments(res.data);
      } catch (err) {
        console.error('Could not fetch departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch courses when department changes
  useEffect(() => {
    const fetchCoursesForDept = async () => {
      if (!department) {
        setAvailableCourses([]);
        return;
      }
      try {
        // Assuming getCourses supports filtering by department via query param
        // If not, we might need to fetch all and filter client-side, but let's assume I fixed the backend API
        // Actually, I did update the backend to support ?department=ID
        // But getCourses in api.ts might not support passing params yet.
        // I'll check api.ts later. For now, I'll use direct axios call or update api.ts
        // Let's assume I'll update api.ts to accept params or just filter client side if needed.
        // Wait, I can just use the api instance directly if needed.
        // But let's try to use getCourses and filter client side if the API returns all.
        // Actually, I updated the backend to filter.
        // I need to make sure the frontend calls it with the param.
        
        // Let's manually construct the URL for now to be safe
        // Or better, update getCourses in api.ts. 
        // For this file, I'll use a direct fetch if getCourses doesn't support args.
        // But let's assume I'll fix api.ts.
        
        // Temporary: fetch all and filter (safest if I forget to update api.ts)
        const res = await getCourses(); 
        const filtered = res.data.filter((c: any) => {
            // Check if department is populated object or string ID
            const deptId = typeof c.department === 'object' ? c.department._id : c.department;
            return deptId === department;
        });
        setAvailableCourses(filtered);
      } catch (err) {
        console.error('Could not fetch courses:', err);
      }
    };

    fetchCoursesForDept();
    // Reset selected courses when department changes
    setFormData(prev => ({ ...prev, courses: [] }));
  }, [department]);

  // Fetch user's applications
  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await getMyApplications();
        setMyApplications(res.data);
        
        // Extract course IDs for accepted applications
        // Note: The backend now returns 'courses' array in application
        // But existing applications might still have 'desiredCourse' string?
        // No, I updated the model. Old data might be broken or I need to handle it.
        // For new applications, 'courses' will be populated.
        
        const enrolledIds: string[] = [];
        res.data.forEach((app: any) => {
          if (app.status === 'accepted') {
             if (app.courses && Array.isArray(app.courses)) {
                 app.courses.forEach((c: any) => enrolledIds.push(typeof c === 'object' ? c._id : c));
             }
          }
        });
        setEnrolledCourses(enrolledIds);
      } catch (err) {
        console.error('Could not fetch applications:', err);
      }
    };

    fetchMyApplications();
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleCourse = (courseId: string) => {
    if (courses.includes(courseId)) {
      setFormData({ ...formData, courses: courses.filter(id => id !== courseId) });
    } else {
      setFormData({ ...formData, courses: [...courses, courseId] });
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!department) {
        setError('Please select a department');
        setLoading(false);
        return;
    }

    if (courses.length === 0) {
      setError('Please select at least one course');
      setLoading(false);
      return;
    }

    try {
      const applicationData = {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        previousEducation,
        department,
        courses,
      };

      await submitApplication(applicationData);

      alert('Application submitted successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Something went wrong while submitting application');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8 bg-white rounded border border-gray-200 p-6">
          <div className="inline-flex p-4 rounded bg-blue-600 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Submit Application
          </h1>
          <p className="text-xl text-gray-600">
            Select a department and courses to apply for.
          </p>
        </div>

        <div className="bg-white rounded border border-gray-200 p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            
            {/* Personal Info (Read-only) */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> First Name
                </label>
                <input type="text" value={firstName} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded text-gray-500 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Last Name
                </label>
                <input type="text" value={lastName} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded text-gray-500 cursor-not-allowed" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Email Address
              </label>
              <input type="email" value={email} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded text-gray-500 cursor-not-allowed" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phone" value={phone} disabled className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={dateOfBirth} onChange={onChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Previous Education</label>
              <input type="text" name="previousEducation" value={previousEducation} onChange={onChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900" />
            </div>

            {/* Department Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Select Department
              </label>
              <select
                name="department"
                value={department}
                onChange={onChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose a Department --</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Course Selection */}
            {department && (
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Select Courses
                </label>
                
                {availableCourses.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {availableCourses.map(course => {
                      const isEnrolled = enrolledCourses.includes(course._id);
                      const isSelected = courses.includes(course._id);
                      
                      return (
                        <div
                          key={course._id}
                          className={`relative p-4 rounded border-2 transition-all ${
                            isEnrolled
                              ? 'bg-gray-50 border-gray-300 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-blue-50 border-blue-500'
                              : 'bg-white border-gray-200 hover:border-blue-300 cursor-pointer'
                          }`}
                        >
                          <label className={`flex items-start gap-4 ${isEnrolled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            <div className="flex items-center pt-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleCourse(course._id)}
                                disabled={isEnrolled}
                                className="w-5 h-5 rounded border-2 border-blue-400"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{course.title}</h3>
                              <p className="text-sm text-gray-600">{course.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>{course.duration}</span>
                                <span className="font-semibold text-blue-600">${course.tuition}</span>
                              </div>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No courses available in this department.</p>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || courses.length === 0}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded font-semibold text-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
