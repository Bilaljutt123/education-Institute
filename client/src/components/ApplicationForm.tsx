// src/components/ApplicationForm.tsx

import React, { useEffect, useState, type ChangeEvent, type FormEvent,  } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '@/context/AuthContext';
import { getMyApplication, getCourses, submitApplication } from '@/utils/api';

// Type for the form data
interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  previousEducation: string;
  desiredCourse: string;
}

const ApplicationForm = () => {
    const { user } = useAuth(); // <-- GET THE LOGGED-IN USER OBJECT
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ApplicationFormData>({
      // Pre-fill form with user's data
      firstName: user?.name || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: '',
      dateOfBirth: '',
      previousEducation: '',
      desiredCourse: '',
    });
     const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { firstName, lastName, email, phone, dateOfBirth, previousEducation, desiredCourse } = formData;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await submitApplication(formData);
      navigate('/dashboard'); // Redirect back to dashboard to see the new application
    } catch (err: any) {
      setError(
        err.response?.data?.msg || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };
   useEffect(() => {
    if (user) {
      const fetchMyApplication = async () => {
        try {
          const res = await getMyApplication();
          if (res.data) {
             navigate('/dashboard');
          }
        } catch (err: any) {
           if (err.response && err.response.status !== 404) {
             console.error('Error checking application:', err);
           }
        }
      };

      // Add a new effect to fetch courses
      const fetchCourses = async () => {
        try {
          const res = await getCourses(); // <-- CALL THE NEW API ENDPOINT
          setCourses(res.data); // <-- SET THE STATE WITH THE FETCHED DATA
        } catch (err) {
          console.error('Could not fetch courses:', err);
        }
      };

      fetchMyApplication();
      fetchCourses(); // <-- CALL THE NEW FUNCTION
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Submit Application</CardTitle>
          <CardDescription>Fill out the form below to apply.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Add all your form fields here */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={firstName} onChange={onChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={lastName} onChange={onChange} required />
            </div>
            {/* ... add other fields for email, phone, etc. */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={email} onChange={onChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={phone} onChange={onChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" value={dateOfBirth} onChange={onChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousEducation">Previous Education</Label>
              <Input id="previousEducation" name="previousEducation" value={previousEducation} onChange={onChange} required placeholder="e.g. High School, Bachelor's" />
            </div>
             <div className="space-y-2">
      <Label htmlFor="desiredCourse">Desired Course</Label>
      <select
        id="desiredCourse"
        name="desiredCourse"
        value={desiredCourse} // <-- VALUE IS NOW CONTROLLED BY STATE
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        onChange={onChange}
        required
      >
        <option value="">Select a course</option>
        {/* Map over the 'courses' state to populate the dropdown */}
        {courses.length > 0 ? (
          courses.map((course: any) => (
            <option key={course._id} value={course.title}>
              {course.title}
            </option>
          ))
        ) : (
          <option value="" disabled>Loading courses...</option> // <-- Show a loading option while fetching
        )}
      </select>
    </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
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