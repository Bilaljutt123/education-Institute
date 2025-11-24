// src/components/ApplicationForm.tsx

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getCourses, submitApplication, getMe } from '@/utils/api';
import { FileText, Lock, CheckCircle, BookOpen } from 'lucide-react';

// Type for the form data
interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  previousEducation: string;
  desiredCourse: string[];
}

const ApplicationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    previousEducation: '',
    desiredCourse: [],
  });

  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { firstName, lastName, email, phone, dateOfBirth, previousEducation, desiredCourse } = formData;

  // Fetch user profile and populate form
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        setLoadingProfile(true);

        // Fetch complete user profile data
        const response = await getMe();
        const userData = response.data;
        
        console.log('Fetched user data:', userData);
        console.log('Date of Birth from API:', userData.dateOfBirth);

        // Check if profile is completed
        if (!userData.profileCompleted) {
          alert('Please complete your profile before submitting applications.');
          navigate('/profile');
          setLoadingProfile(false);
          return;
        }

        // Split name into first and last
        const nameParts = userData.name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Format date of birth to YYYY-MM-DD for date input
        let formattedDateOfBirth = '';
        if (userData.dateOfBirth) {
          const date = new Date(userData.dateOfBirth);
          if (!isNaN(date.getTime())) {
            // Format to YYYY-MM-DD
            formattedDateOfBirth = date.toISOString().split('T')[0];
          }
        }

        // Pre-fill form with complete profile data
        setFormData({
          firstName,
          lastName,
          email: userData.email || '',
          phone: userData.phone || '',
          dateOfBirth: formattedDateOfBirth,
          previousEducation: userData.previousEducation || '',
          desiredCourse: [],
        });
        
        setLoadingProfile(false);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Could not load your profile data');
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount - user is accessed inside but not as dependency to avoid loop

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourses();
        setCourses(res.data);
      } catch (err) {
        console.error('Could not fetch courses:', err);
      }
    };

    fetchCourses();
  }, []);

  // Handle input changes (only for editable fields)
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'desiredCourse') {
      const selected = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value);
      setFormData({ ...formData, desiredCourse: selected });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit the form
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (desiredCourse.length === 0) {
      setError('Please select at least one course');
      setLoading(false);
      return;
    }

    try {
      const applicationPromises = desiredCourse.map(async (course) => {
        const applicationData = {
          firstName,
          lastName,
          email,
          phone,
          dateOfBirth,
          previousEducation,
          desiredCourse: course,
        };
        return submitApplication(applicationData);
      });

      await Promise.all(applicationPromises);

      alert(`Successfully submitted ${desiredCourse.length} application(s)!`);
      
      // Reset only the course selection
      setFormData({
        ...formData,
        desiredCourse: [],
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.msg || 'Something went wrong while submitting applications');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-200">
            Submit Application
          </h1>
          <p className="text-xl text-purple-200">
            Apply for one or more courses using your profile information
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 bg-blue-500/20 backdrop-blur-md border border-blue-500/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-300 mt-0.5" />
            <div>
              <p className="text-blue-200 font-medium">Your profile information is locked</p>
              <p className="text-blue-300 text-sm mt-1">
                Email and name are pre-filled from your profile and cannot be changed here. 
                To update them, please edit your profile first.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            
            {/* Name Fields (Read-only) */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-100 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-100 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-100 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Auto-filled but editable fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-100">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={onChange}
                  required
                  disabled
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-100">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={dateOfBirth}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Previous Education */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-100">
                Previous Education
              </label>
              <input
                type="text"
                name="previousEducation"
                value={previousEducation}
                onChange={onChange}
                required
                placeholder="e.g. High School, Bachelor's"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Course Selection (Main editable field) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Select Courses to Apply For
              </label>
              <select
                name="desiredCourse"
                multiple
                value={desiredCourse}
                onChange={onChange}
                required
                className="w-full h-48 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              >
                {courses.length > 0 ? (
                  courses.map(course => (
                    <option key={course._id} value={course.title} className="bg-purple-900 text-white py-2">
                      {course.title}
                    </option>
                  ))
                ) : (
                  <option value="" disabled className="bg-purple-900 text-white">Loading courses...</option>
                )}
              </select>
              <div className="flex items-center gap-2 text-sm text-purple-300">
                <CheckCircle className="w-4 h-4" />
                <span>Hold Ctrl (Cmd on Mac) to select multiple courses</span>
              </div>
              {desiredCourse.length > 0 && (
                <div className="mt-2 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <p className="text-sm text-green-200">
                    {desiredCourse.length} course{desiredCourse.length > 1 ? 's' : ''} selected: {desiredCourse.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-xl p-4">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || desiredCourse.length === 0}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting Applications...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Submit {desiredCourse.length > 0 ? `${desiredCourse.length} ` : ''}Application{desiredCourse.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
