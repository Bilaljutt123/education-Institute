import type { Course } from '@/types';
import { BookOpen, Clock, DollarSign, User } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onCourseClick: (course: Course) => void;
}

const CourseCard = ({ course, onCourseClick }: CourseCardProps) => {
  return (
    <div
      onClick={() => onCourseClick(course)}
      className="group cursor-pointer bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30"
    >
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 group-hover:scale-110 transition-transform">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
          <span className="text-green-200 font-semibold text-sm">${course.tuition}</span>
        </div>
      </div>

      {/* Course Title */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
        {course.title}
      </h3>

      {/* Course Description */}
      <p className="text-purple-200 text-sm mb-4 line-clamp-2">
        {course.description}
      </p>

      {/* Course Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-purple-300 text-sm">
          <Clock className="w-4 h-4" />
          <span>{course.duration}</span>
        </div>
        
        {course.instructor && (
          <div className="flex items-center gap-2 text-purple-300 text-sm">
            <User className="w-4 h-4" />
            <span>{course.instructor}</span>
          </div>
        )}
      </div>

      {/* View Details Button */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <span className="text-purple-300 text-sm group-hover:text-white transition-colors">
          Click to view details →
        </span>
      </div>
    </div>
  );
};

export default CourseCard;