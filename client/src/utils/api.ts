import type { ApiResponse, Application, ApplicationWithDetails, Course, LoginData, RegisterData, User } from '@/types';
import axios from 'axios';

interface MeResponse extends ApiResponse<User> {}

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- TYPED API FUNCTIONS ---
export const login = async (data: LoginData): Promise<ApiResponse<{ token: string }>> => {
  const response = await api.post<ApiResponse<{ token: string }>>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<ApiResponse<{ token: string }>> => {
  const response = await api.post<ApiResponse<{ token: string }>>('/auth/register', data);
  return response.data;
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await api.get<MeResponse>('/users/me');
  return response.data;
};

export const getMyApplication:any = async () => {
  const response = await api.get<ApiResponse<Application>>('/applications/me');
  return response.data;
};

// Get all applications for the logged-in student
export const getMyApplications = async (): Promise<ApiResponse<Application[]>> => {
  const response = await api.get<ApiResponse<Application[]>>('/applications/my-applications');
  return response.data;
};

export const getCourses = async (): Promise<ApiResponse<Course[]>> => {
  const response = await api.get<ApiResponse<Course[]>>('/courses');
  return response.data;
};

export const submitApplication = async (
  data: Omit<Application, '_id' | 'student' | 'createdAt' | 'status'>
): Promise<ApiResponse<Application>> => {
  const response = await api.post<ApiResponse<Application>>('/applications', data);
  return response.data;
};

export const getApplications = async (): Promise<ApiResponse<Application[]>> => {
  const response = await api.get<ApiResponse<Application[]>>('/applications');
  return response.data;
};

export const getApplicationsWithDetails = async (): Promise<ApiResponse<ApplicationWithDetails[]>> => {
  const response = await api.get<ApiResponse<ApplicationWithDetails[]>>('/applications');
  return response.data;
};

export const updateApplicationStatus = async (
  id: string,
  data: { status: 'accepted' | 'rejected' }
): Promise<ApiResponse<Application>> => {
  const response = await api.put<ApiResponse<Application>>(`/applications/${id}`, data);
  return response.data;
};

export const deleteApplication = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/applications/${id}`);
  return response.data;
};

// Named export for axios instance
export { api };
