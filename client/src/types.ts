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

// Type for a Department object
export interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
  head?: string;
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
  department: string | Department; // Can be ID or populated Department object
  schedule?: {
    startDate: string;
    endDate: string;
  };
  createdAt: string;
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
  department: string | Department;
  courses: (string | Course)[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Type for Application with populated student and course (used in admin views)
export interface ApplicationWithDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  previousEducation: string;
  student?: {
    _id: string;
    name: string;
    email: string;
    address?: {
      city?: string;
    };
    emergencyContact?: {
      relationship?: string;
      phone?: string;
    };
  };
  department?: Department;
  courses?: Course[];
  status: 'pending' | 'accepted' | 'rejected';
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

// Type for Student Request
export interface Request {
  _id: string;
  student: string | User;
  type: 'Sick Leave' | 'Urgent Leave' | 'Complaint' | 'Other';
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Type for GPA object
export interface GPA {
  _id: string;
  student: string | User;
  department: string | Department;
  semester: number;
  gpa: number;
  createdAt: string;
}