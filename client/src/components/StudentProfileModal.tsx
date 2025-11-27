import { X, User, Mail, Phone, Calendar, GraduationCap, MapPin, UserCircle } from 'lucide-react';
import type { ApplicationWithDetails } from '@/types';

interface StudentProfileModalProps {
  application: ApplicationWithDetails | null;
  onClose: () => void;
}

const StudentProfileModal = ({ application, onClose }: StudentProfileModalProps) => {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded border border-gray-200 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all z-10"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Header */}
        <div className="p-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
              <User className="w-10 h-10 text-white" />
            </div>
            
            {/* Student Name & Email */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {application.firstName} {application.lastName}
              </h2>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{application.email}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`px-4 py-2 rounded border font-semibold ${
              application.status === 'pending' 
                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                : application.status === 'accepted'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Personal Details Section */}
          <div className="bg-gray-50 rounded border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-blue-600" />
              Personal Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium">Phone</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{application.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium">Date of Birth</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">
                    {application.dateOfBirth ? new Date(application.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium">City</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{application.student?.address?.city || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium">Emergency Contact</p>
                <div className="text-gray-900">
                  <p className="font-semibold">{application.student?.emergencyContact?.phone || 'N/A'}</p>
                  <p className="text-xs text-gray-600">
                    {application.student?.emergencyContact?.relationship ? `(${application.student.emergencyContact.relationship})` : ''}
                  </p>
                </div>
              </div>
              
               <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-gray-600 font-medium">Previous Education</p>
                <p className="text-gray-900 font-semibold">{application.previousEducation || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Application Info Section */}
          <div className="bg-gray-50 rounded border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              Application Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Desired Course */}
              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium">Desired Course</p>
                <p className="text-gray-900 font-semibold">
                  {application.desiredCourse || application.course?.title || 'N/A'}
                </p>
              </div>

              {/* Application Date */}
              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium">Applied On</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">
                    {new Date(application.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded font-semibold hover:bg-gray-300 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;
