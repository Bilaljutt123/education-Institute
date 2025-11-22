// src/components/ApplicationForm.tsx

import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '@/context/AuthContext';
import { getCourses, submitApplication } from '@/utils/api';

// Type for the form data
interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  previousEducation: string;
  desiredCourse: string[]; // <-- MULTIPLE COURSES
}

const ApplicationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if profile is completed
  useEffect(() => {
    if (user && !user.profileCompleted) {
      alert('Please complete your profile before submitting applications.');
      navigate('/profile');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    previousEducation: '',
    desiredCourse: [], // <-- empty array for multi-select
  });

  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { firstName, lastName, email, phone, dateOfBirth, previousEducation, desiredCourse } = formData;

  // Handle input changes
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'desiredCourse') {
      // Handle multiple course selection
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

    // Validate that at least one course is selected
    if (desiredCourse.length === 0) {
      setError('Please select at least one course');
      setLoading(false);
      return;
    }

    try {
      // Submit one application for each selected course
      const applicationPromises = desiredCourse.map(async (course) => {
        const applicationData = {
          firstName,
          lastName,
          email,
          phone,
          dateOfBirth,
          previousEducation,
          desiredCourse: course, // Single course per application
        };
        return submitApplication(applicationData);
      });

      // Wait for all applications to be submitted
      await Promise.all(applicationPromises);

      alert(`Successfully submitted ${desiredCourse.length} application(s)!`);
      
      // Reset the form
      setFormData({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        email: user?.email || '',
        phone: '',
        dateOfBirth: '',
        previousEducation: '',
        desiredCourse: [],
      });

      // Optionally navigate to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.msg || 'Something went wrong while submitting applications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses
  useEffect(() => {
    if (!user) return;

    const fetchCourses = async () => {
      try {
        const res = await getCourses();
        setCourses(res.data);
      } catch (err) {
        console.error('Could not fetch courses:', err);
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Submit Application</CardTitle>
          <CardDescription>Fill out the form below to apply for one or more courses.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={firstName} onChange={onChange} required />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={lastName} onChange={onChange} required />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={email} onChange={onChange} required />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={phone} onChange={onChange} required />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" value={dateOfBirth} onChange={onChange} required />
            </div>

            {/* Previous Education */}
            <div className="space-y-2">
              <Label htmlFor="previousEducation">Previous Education</Label>
              <Input
                id="previousEducation"
                name="previousEducation"
                value={previousEducation}
                onChange={onChange}
                required
                placeholder="e.g. High School, Bachelor's"
              />
            </div>

            {/* Desired Courses (MULTI-SELECT) */}
            <div className="space-y-2">
              <Label htmlFor="desiredCourse">Desired Courses</Label>
              <select
                id="desiredCourse"
                name="desiredCourse"
                multiple
                value={desiredCourse}
                onChange={onChange}
                className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                {courses.length > 0 ? (
                  courses.map(course => (
                    <option key={course._id} value={course.title}>
                      {course.title}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Loading courses...</option>
                )}
              </select>
              <p className="text-sm text-gray-500">Hold Ctrl (Cmd on Mac) to select multiple courses.</p>
            </div>

            {/* Error message */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationForm;
