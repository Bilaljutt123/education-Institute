import { useState, type FormEvent,  } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { api } from '@/utils/api';

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

  if (!user) return <div>Loading...</div>;

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please fill out your profile information before submitting applications. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input type="tel" id="phone" name="phone" value={phone} onChange={onChange} required />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input type="date" id="dateOfBirth" name="dateOfBirth" value={dateOfBirth} onChange={onChange} required />
                </div>
              </div>
              <div>
                <Label htmlFor="previousEducation">Previous Education *</Label>
                <Input type="text" id="previousEducation" name="previousEducation" value={previousEducation} onChange={onChange} required />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address (Optional)</h3>
              <Input type="text" id="street" name="street" value={street} onChange={onChange} placeholder="Street" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input type="text" id="city" name="city" value={city} onChange={onChange} placeholder="City" />
                <Input type="text" id="state" name="state" value={state} onChange={onChange} placeholder="State" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input type="text" id="zipCode" name="zipCode" value={zipCode} onChange={onChange} placeholder="ZIP" />
                <Input type="text" id="country" name="country" value={country} onChange={onChange} placeholder="Country" />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input type="text" id="emergencyContactName" name="emergencyContactName" value={emergencyContactName} onChange={onChange} placeholder="Name" />
                <Input type="text" id="emergencyContactRelationship" name="emergencyContactRelationship" value={emergencyContactRelationship} onChange={onChange} placeholder="Relationship" />
              </div>
              <Input type="tel" id="emergencyContactPhone" name="emergencyContactPhone" value={emergencyContactPhone} onChange={onChange} placeholder="Phone" />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">{loading ? 'Saving...' : 'Save Profile'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} disabled={loading}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
