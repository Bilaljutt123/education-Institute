// src/components/ApplicationForm.tsx

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getCourses, submitApplication, getMe, getMyApplications } from '@/utils/api';
import { FileText, Lock, CheckCircle, BookOpen, Clock } from 'lucide-react';

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
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
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

  // Fetch user's applications to identify enrolled courses
  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await getMyApplications();
        setMyApplications(res.data);
        
        // Extract course titles for accepted applications (enrolled courses)
        const enrolled = res.data
          .filter((app: any) => app.status === 'accepted')
          .map((app: any) => app.desiredCourse);
        setEnrolledCourses(enrolled);
      } catch (err) {
        console.error('Could not fetch applications:', err);
      }
    };

    fetchMyApplications();
  }, []);

  // Handle input changes (only for editable fields)
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox toggle for course selection
  const toggleCourse = (courseTitle: string) => {
    if (desiredCourse.includes(courseTitle)) {
      setFormData({ ...formData, desiredCourse: desiredCourse.filter(c => c !== courseTitle) });
    } else {
      setFormData({ ...formData, desiredCourse: [...desiredCourse, courseTitle] });
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

            {/* Course Selection with Checkboxes */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-purple-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Select Courses to Apply For
              </label>
              
              {courses.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {courses.map(course => {
                    const isEnrolled = enrolledCourses.includes(course.title);
                    const isSelected = desiredCourse.includes(course.title);
                    const hasPendingApplication = myApplications.some(
                      (app: any) => app.desiredCourse === course.title && app.status === 'pending'
                    );

                    return (
                      <div
                        key={course._id}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                          isEnrolled
                            ? 'bg-white/5 border-green-500/30 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20'
                            : 'bg-white/10 border-white/20 hover:border-purple-400/50 cursor-pointer'
                        }`}
                      >
                        <label className={`flex items-start gap-4 ${isEnrolled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                          {/* Checkbox */}
                          <div className="flex items-center pt-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCourse(course.title)}
                              disabled={isEnrolled}
                              className="w-5 h-5 rounded border-2 border-purple-400 bg-white/10 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>

                          {/* Course Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className={`font-semibold text-lg ${isEnrolled ? 'text-gray-400' : 'text-white'}`}>
                                  {course.title}
                                </h3>
                                <p className={`text-sm mt-1 ${isEnrolled ? 'text-gray-500' : 'text-purple-200'}`}>
                                  {course.description}
                                </p>
                              </div>
                              
                              {/* Status Badges */}
                              <div className="flex flex-col gap-2">
                                {isEnrolled && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-200 border border-green-500/50 text-xs font-semibold whitespace-nowrap">
                                    <Lock className="w-3 h-3" />
                                    Already Enrolled
                                  </span>
                                )}
                                {hasPendingApplication && !isEnrolled && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-200 border border-yellow-500/50 text-xs font-semibold whitespace-nowrap">
                                    <Clock className="w-3 h-3" />
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Course Details */}
                            <div className="flex items-center gap-4 mt-3 text-sm">
                              <span className={isEnrolled ? 'text-gray-500' : 'text-purple-300'}>
                                {course.duration}
                              </span>
                              <span className={`font-semibold ${isEnrolled ? 'text-gray-400' : 'text-green-400'}`}>
                                ${course.tuition}
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-purple-200">
                  Loading courses...
                </div>
              )}

              {/* Selected Courses Summary */}
              {desiredCourse.length > 0 && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                  <div className="flex items-center gap-2 text-green-200 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      {desiredCourse.length} course{desiredCourse.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <p className="text-sm text-green-300">
                    {desiredCourse.join(', ')}
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
