import type { Course } from '@/types';
import { BookOpen, Clock, User } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onCourseClick: (course: Course) => void;
}

const CourseCard = ({ course, onCourseClick }: CourseCardProps) => {
  return (
    <div
      onClick={() => onCourseClick(course)}
      className="cursor-pointer bg-white rounded border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all"
    >
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded bg-blue-600">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div className="px-3 py-1 bg-green-50 border border-green-200 rounded">
          <span className="text-green-700 font-semibold text-sm">${course.tuition}</span>
        </div>
      </div>

      {/* Course Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {course.title}
      </h3>

      {/* Course Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {course.description}
      </p>

      {/* Course Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Clock className="w-4 h-4" />
          <span>{course.duration}</span>
        </div>
        
        {course.instructor && (
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <User className="w-4 h-4" />
            <span>{course.instructor}</span>
          </div>
        )}
      </div>

      {/* View Details Button */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <span className="text-blue-600 text-sm hover:text-blue-700 transition-colors">
          Click to view details →
        </span>
      </div>
    </div>
  );
};

export default CourseCard;