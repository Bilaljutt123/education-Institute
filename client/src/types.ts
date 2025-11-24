// src/types.ts

// Type for a User object
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  previousEducation?: string;
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  profileCompleted?: boolean;
}

// Type for an Application object
export interface Application {
  _id: string;
  student: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  previousEducation: string;
  desiredCourse: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Type for Application with populated student and course (used in admin views)
export interface ApplicationWithDetails {
  _id: string;
  studentName: string;
  email: string;
  course?: {
    _id: string;
    title: string;
  };
  desiredCourse?: string; // Fallback if course is stored as string
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Type for a Course object
export interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  tuition: number;
  instructor?: string;
  schedule?: {
    startDate: string;
    endDate: string;
  };
  createdAt: string;
}

// Type for the Login form data
export interface LoginData {
  email: string;
  password: string;
}

// Type for the Register form data
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
}

// Type for the API response structure
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  msg?: string;
}