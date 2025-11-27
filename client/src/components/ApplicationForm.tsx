// src/components/ApplicationForm.tsx

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getCourses, submitApplication, getMe, getMyApplications } from '@/utils/api';
import { FileText, Lock, CheckCircle, BookOpen, Clock, ArrowLeft } from 'lucide-react';

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
  }, []);

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
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8 bg-white rounded border border-gray-200 p-6">
          <div className="inline-flex p-4 rounded bg-blue-600 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Submit Application
          </h1>
          <p className="text-xl text-gray-600">
            Apply for one or more courses using your profile information
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-blue-900 font-medium">Your profile information is locked</p>
              <p className="text-blue-700 text-sm mt-1">
                Email and name are pre-filled from your profile and cannot be changed here. 
                To update them, please edit your profile first.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded border border-gray-200 p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            
            {/* Name Fields (Read-only) */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Auto-filled but editable fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={onChange}
                  required
                  disabled
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={dateOfBirth}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Previous Education */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Previous Education
              </label>
              <input
                type="text"
                name="previousEducation"
                value={previousEducation}
                onChange={onChange}
                required
                placeholder="e.g. High School, Bachelor's"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Course Selection with Checkboxes */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                        className={`relative p-4 rounded border-2 transition-all ${
                          isEnrolled
                            ? 'bg-gray-50 border-gray-300 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-50 border-blue-500'
                            : 'bg-white border-gray-200 hover:border-blue-300 cursor-pointer'
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
                              className="w-5 h-5 rounded border-2 border-blue-400 bg-white text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>

                          {/* Course Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className={`font-semibold text-lg ${isEnrolled ? 'text-gray-400' : 'text-gray-900'}`}>
                                  {course.title}
                                </h3>
                                <p className={`text-sm mt-1 ${isEnrolled ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {course.description}
                                </p>
                              </div>
                              
                              {/* Status Badges */}
                              <div className="flex flex-col gap-2">
                                {isEnrolled && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-green-50 text-green-700 border border-green-200 text-xs font-semibold whitespace-nowrap">
                                    <Lock className="w-3 h-3" />
                                    Already Enrolled
                                  </span>
                                )}
                                {hasPendingApplication && !isEnrolled && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-semibold whitespace-nowrap">
                                    <Clock className="w-3 h-3" />
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Course Details */}
                            <div className="flex items-center gap-4 mt-3 text-sm">
                              <span className={isEnrolled ? 'text-gray-400' : 'text-gray-600'}>
                                {course.duration}
                              </span>
                              <span className={`font-semibold ${isEnrolled ? 'text-gray-400' : 'text-blue-600'}`}>
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
                <div className="text-center py-8 text-gray-600">
                  Loading courses...
                </div>
              )}

              {/* Selected Courses Summary */}
              {desiredCourse.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      {desiredCourse.length} course{desiredCourse.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    {desiredCourse.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || desiredCourse.length === 0}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded font-semibold text-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
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
