// src/components/CourseDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/utils/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  tuition: number;
  instructor?: string;
  schedule?: {
    startDate: string;
    endDate: string;
  };
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>(); // Get the course ID from the URL
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          const res = await api.get<{ data: Course }>(`/courses/${id}`);
          setCourse(res.data.data);
        } catch (err) {
          console.error('Could not fetch course details:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [id]); // Rerun effect if the ID in the URL changes

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-4">
        <p>Course not found.</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <Button onClick={() => navigate(-1)} className="mb-4">
        Back to Courses
      </Button>

      {/* Course Details */}
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{course.title}</CardTitle>
          <CardDescription className="text-base mt-2">
            {course.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-semibold mr-2">Duration:</span>
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">Tuition:</span>
                <span className="text-green-600 font-bold">${course.tuition}</span>
              </div>
              {course.instructor && (
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Instructor:</span>
                  <span>{course.instructor}</span>
                </div>
              )}
            </div>
            {course.schedule && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Start Date:</span>
                  <span>{new Date(course.schedule.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">End Date:</span>
                  <span>{new Date(course.schedule.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetail;