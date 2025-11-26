import { X, User, Mail, Phone, Calendar, GraduationCap, MapPin, UserCircle, AlertCircle } from 'lucide-react';
import type { ApplicationWithDetails } from '@/types';

interface StudentProfileModalProps {
  application: ApplicationWithDetails | null;
  onClose: () => void;
}

const StudentProfileModal = ({ application, onClose }: StudentProfileModalProps) => {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl border border-white/20 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 hover:scale-110 z-10"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Header */}
        <div className="relative p-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            
            {/* Student Name & Email */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">
                {application.firstName} {application.lastName}
              </h2>
              <div className="flex items-center gap-2 text-purple-200">
                <Mail className="w-4 h-4" />
                <span>{application.email}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-full border font-semibold ${
              application.status === 'pending' 
                ? 'bg-yellow-500/20 text-yellow-200 border-yellow-500/50'
                : application.status === 'accepted'
                ? 'bg-green-500/20 text-green-200 border-green-500/50'
                : 'bg-red-500/20 text-red-200 border-red-500/50'
            }`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Personal Details Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-purple-400" />
              Personal Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-purple-300 font-medium">Phone</p>
                <div className="flex items-center gap-2 text-white">
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold">{application.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-purple-300 font-medium">Date of Birth</p>
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold">
                    {application.dateOfBirth ? new Date(application.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-purple-300 font-medium">City</p>
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold">{application.student?.address?.city || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-purple-300 font-medium">Emergency Contact</p>
                <div className="text-white">
                  <p className="font-semibold">{application.student?.emergencyContact?.phone || 'N/A'}</p>
                  <p className="text-xs text-purple-300">
                    {application.student?.emergencyContact?.relationship ? `(${application.student.emergencyContact.relationship})` : ''}
                  </p>
                </div>
              </div>
              
               <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-purple-300 font-medium">Previous Education</p>
                <p className="text-white font-semibold">{application.previousEducation || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Application Info Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-purple-400" />
              Application Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Desired Course */}
              <div className="space-y-1">
                <p className="text-sm text-purple-300 font-medium">Desired Course</p>
                <p className="text-white font-semibold">
                  {application.desiredCourse || application.course?.title || 'N/A'}
                </p>
              </div>

              {/* Application Date */}
              <div className="space-y-1">
                <p className="text-sm text-purple-300 font-medium">Applied On</p>
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4 text-purple-400" />
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
              className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
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
