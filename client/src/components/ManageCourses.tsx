// src/components/ManageCourses.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useNavigate } from 'react-router-dom';
import type { Course } from '@/types';
import { api, getCourses } from '@/utils/api';

const ManageCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      const fetchCourses = async () => {
        try {
          const res = await getCourses();
          setCourses(res.data);
        } catch (err) {
          console.error('Could not fetch courses:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/courses/${id}`);
      // Remove the deleted course from the state
      setCourses(prev => prev.filter(course => course._id !== id));
    } catch (err) {
      console.error('Could not delete course:', err);
    }
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Manage Courses</h1>
      <Button onClick={() => navigate('/create-course')} className="mb-4">
        Add New Course
      </Button>
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tuition
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${course.tuition}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <Button
                    onClick={() => handleDelete(course._id)}
                    variant="destructive"
                    className='text-red-500'
                    size="sm"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-10 text-gray-500">
                No courses available at the moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCourses;