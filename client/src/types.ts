// src/types.ts

// Type for a User object
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
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
  
  // Type for a Course object
  export interface Course {
    _id: string;
    title: string;
    description: string;
    duration: string;
    tuition: number;
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