// src/components/ApplicationForm.tsx

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '@/context/AuthContext';

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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { firstName, lastName, email, phone, dateOfBirth, previousEducation, desiredCourse } = formData;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/applications', formData);
      navigate('/dashboard'); // Redirect back to dashboard to see the new application
    } catch (err: any) {
      setError(
        err.response?.data?.msg || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

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
              <Label htmlFor="desiredCourse">Desired Course</Label>
              <select
                id="desiredCourse"
                name="desiredCourse"
                value={desiredCourse}
                onChange={onChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select a course</option>
                <option value="Introduction to React">Introduction to React</option>
                <option value="Node.js & Express Backend Development">Node.js & Express Backend Development</option>
                <option value="Python for Data Science">Python for Data Science</option>
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