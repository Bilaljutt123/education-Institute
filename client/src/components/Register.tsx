// src/components/Register.tsx

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
}

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { name, email, password, role } = formData;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/register', formData);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Welcome Message */}
        <div className="hidden md:block">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Start Your Journey!
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join thousands of students transforming their future through education. Create your account and get started today.
          </p>
          
          <div className="space-y-4">
            {[
              'Access 500+ premium courses',
              'Learn from expert instructors',
              'Earn recognized certifications',
              'Join a vibrant learning community'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full">
          <div className="bg-white rounded border border-gray-200 shadow-sm p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded bg-blue-600 mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Get started with your free account</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="e.g., student@example.com"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Create a strong password"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Register As
                </label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="student">Student</option>
                  {/* <option value="admin">Admin</option> */}
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded font-semibold text-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-300 inline-flex items-center gap-2"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;