// src/components/CourseCard.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  onCourseClick: (course: Course) => void;
}

const CourseCard = ({ course, onCourseClick }: CourseCardProps) => {
  const handleViewDetails = () => {
    onCourseClick(course);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" 
      onClick={handleViewDetails}
    >
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">
          <strong>Duration:</strong> {course.duration}
        </p>
        <p className="text-sm">
          <strong>Tuition:</strong> <span className="text-green-600 font-semibold">${course.tuition}</span>
        </p>
        {course.instructor && (
          <p className="text-sm">
            <strong>Instructor:</strong> {course.instructor}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;