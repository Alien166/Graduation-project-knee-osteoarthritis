import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/auth';

import { jwtDecode as decodeJwt, JwtPayload } from "jwt-decode";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  rePassword: string;
}

export interface ResetPasswordData {
  email: string;
  newPassword: string;
  reNewPassword: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  reNewPassword: string;
}
interface CustomJwtPayload extends JwtPayload {
  userId: string;
  userName: string;
  userEmail: string;
}
const authService = {


  // Get user details
  getUserDetails: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    if (token) {
      const decodedToken = decodeJwt(token) as CustomJwtPayload;
      console.log('Decoded Token:', decodedToken);
      return {
        userId: decodedToken.userId,
        userName: decodedToken.userName,
        userEmail: decodedToken.userEmail,

      }
    }
  }
  ,
  // Register new user
  signup: async (userData: SignupData) => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Login user
  signin: async (credentials: LoginCredentials) => {
    const response = await axios.post(`${API_URL}/signin`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: ChangePasswordData) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(
      `${API_URL}/changepassword`,
      passwordData,
      {
        headers: { token }
      }
    );
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Verify email
  verifyEmail: async (code: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/verification`, {
      params: { code },
      headers: { token }
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await axios.post(`${API_URL}/forgetPassword`, { email });
    return response.data;
  },

  // Check reset code
  checkResetCode: async (email: string, code: string) => {
    const response = await axios.post(`${API_URL}/checkCode`, { email, code });
    return response.data;
  },

  // Reset password
  resetPassword: async (resetData: ResetPasswordData) => {
    const response = await axios.post(`${API_URL}/resetPassword`, resetData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },

  // Get current token
  getCurrentToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }

};

export default authService;

function jwtDecode(token: string) {
  throw new Error('Function not implemented.');
}
