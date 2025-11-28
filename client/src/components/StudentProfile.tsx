import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '@/utils/api';
import { User, MapPin, Phone, GraduationCap, Save, ArrowLeft } from 'lucide-react';

interface StudentProfileFormData {
  phone: string;
  dateOfBirth: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  previousEducation: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
}

const StudentProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<StudentProfileFormData>({
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    previousEducation: user?.previousEducation || '',
    emergencyContactName: user?.emergencyContact?.name || '',
    emergencyContactRelationship: user?.emergencyContact?.relationship || '',
    emergencyContactPhone: user?.emergencyContact?.phone || '',
  });

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-700 text-lg">Loading profile...</p>
      </div>
    </div>
  );

  const {
    phone,
    dateOfBirth,
    street,
    city,
    state,
    zipCode,
    country,
    previousEducation,
    emergencyContactName,
    emergencyContactRelationship,
    emergencyContactPhone,
  } = formData;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const profileData = {
        phone,
        dateOfBirth,
        address: { street, city, state, zipCode, country },
        previousEducation,
        emergencyContact: {
          name: emergencyContactName,
          relationship: emergencyContactRelationship,
          phone: emergencyContactPhone,
        },
      };

      const res = await api.put('/users/profile', profileData);

      if (setUser) setUser(res.data.data);

      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8 bg-white rounded border border-gray-200 p-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Your Profile
          </h1>
          <p className="text-xl text-gray-600">
            Please fill out your profile information before submitting applications.
          </p>
        </div>

        <div className="bg-white rounded border border-gray-200 p-8">
          <form onSubmit={onSubmit} className="space-y-8">
            
            {/* Personal Information Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded bg-blue-50">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className={labelClasses}>Phone Number *</label>
                  <input type="tel" id="phone" name="phone" value={phone} onChange={onChange} required className={inputClasses} placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className={labelClasses}>Date of Birth *</label>
                  <input type="date" id="dateOfBirth" name="dateOfBirth" value={dateOfBirth} onChange={onChange} required className={inputClasses} />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded bg-blue-50">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Previous Education</h2>
              </div>
              
              <div>
                <label htmlFor="previousEducation" className={labelClasses}>Highest Qualification *</label>
                <input type="text" id="previousEducation" name="previousEducation" value={previousEducation} onChange={onChange} required className={inputClasses} placeholder="e.g. High School Diploma, Bachelor's Degree" />
              </div>
            </div>

            {/* Address Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded bg-blue-50">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Address Details</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="street" className={labelClasses}>Street Address</label>
                  <input type="text" id="street" name="street" value={street} onChange={onChange} className={inputClasses} placeholder="123 Main St" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className={labelClasses}>City</label>
                    <input type="text" id="city" name="city" value={city} onChange={onChange} className={inputClasses} placeholder="New York" />
                  </div>
                  <div>
                    <label htmlFor="state" className={labelClasses}>State / Province</label>
                    <input type="text" id="state" name="state" value={state} onChange={onChange} className={inputClasses} placeholder="NY" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="zipCode" className={labelClasses}>ZIP / Postal Code</label>
                    <input type="text" id="zipCode" name="zipCode" value={zipCode} onChange={onChange} className={inputClasses} placeholder="10001" />
                  </div>
                  <div>
                    <label htmlFor="country" className={labelClasses}>Country</label>
                    <input type="text" id="country" name="country" value={country} onChange={onChange} className={inputClasses} placeholder="United States" />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded bg-blue-50">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Emergency Contact</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="emergencyContactName" className={labelClasses}>Contact Name</label>
                  <input type="text" id="emergencyContactName" name="emergencyContactName" value={emergencyContactName} onChange={onChange} className={inputClasses} placeholder="Jane Doe" />
                </div>
                <div>
                  <label htmlFor="emergencyContactRelationship" className={labelClasses}>Relationship</label>
                  <input type="text" id="emergencyContactRelationship" name="emergencyContactRelationship" value={emergencyContactRelationship} onChange={onChange} className={inputClasses} placeholder="Parent, Spouse, etc." />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="emergencyContactPhone" className={labelClasses}>Contact Phone</label>
                  <input type="tel" id="emergencyContactPhone" name="emergencyContactPhone" value={emergencyContactPhone} onChange={onChange} className={inputClasses} placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-green-700">{success}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 bg-blue-600 text-white rounded font-semibold text-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Profile
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded font-semibold text-lg hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
