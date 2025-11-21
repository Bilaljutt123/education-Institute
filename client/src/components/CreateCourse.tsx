// src/components/CreateCourse.tsx

import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { api } from '@/utils/api';

// Type for form data
interface CourseFormData {
  title: string;
  description: string;
  duration: string;
  tuition: number;
  instructor: string;
  schedule: {
    startDate: string;
    endDate: string;
  };
}

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    duration: '',
    tuition: 0,
    instructor: '',
    schedule: {
      startDate: '',
      endDate: '',
    },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { title, description, duration, tuition, instructor } = formData;
  const { startDate, endDate } = formData.schedule;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested schedule fields
    if (name === 'startDate' || name === 'endDate') {
      setFormData({
        ...formData,
        schedule: {
          ...formData.schedule,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/courses', formData);
      navigate('/manage-courses'); // Redirect to course list page
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
          <CardTitle>Create New Course</CardTitle>
          <CardDescription>
            Fill out the form below to add a new course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" name="title" value={title} onChange={onChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Course Description</Label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={onChange}
                className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" name="duration" value={duration} onChange={onChange} required placeholder="e.g., 3 Months" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tuition">Tuition</Label>
              <Input id="tuition" name="tuition" type="number" value={tuition} onChange={onChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input id="instructor" name="instructor" value={instructor} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" value={startDate} onChange={onChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" value={endDate} onChange={onChange} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Course'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCourse;