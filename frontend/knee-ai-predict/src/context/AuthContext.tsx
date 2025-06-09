import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { LoginCredentials, SignupData, ChangePasswordData, ResetPasswordData } from '../services/auth.service';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';

interface AuthContextType {
  user: { token: string } | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: SignupData) => Promise<void>;
  logout: () => void;
  changePassword: (passwordData: ChangePasswordData) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (resetData: ResetPasswordData) => Promise<void>;
  isAuthenticated: boolean;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
      stack?: string;
    };
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = authService.getCurrentToken();
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const data = await authService.signin(credentials);
      setUser({ token: data.token });
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate('/dashboard');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData: SignupData) => {
    try {
      setError(null);
      const data = await authService.signup(userData);
      setUser({ token: data.token });
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      navigate('/auth/verify-email');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate('/auth/login');
  };

  const changePassword = async (passwordData: ChangePasswordData) => {
    try {
      setError(null);
      const data = await authService.changePassword(passwordData);
      setUser({ token: data.token });
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const errorMessage = error.response?.data?.error || 'Password change failed';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyEmail = async (code: string) => {
    try {
      setError(null);
      await authService.verifyEmail(code);
      toast({
        title: "Success",
        description: "Email verified successfully",
      });
      navigate('/dashboard');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const errorMessage = error.response?.data?.error || 'Email verification failed';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setError(null);
      await authService.forgotPassword(email);
      toast({
        title: "Success",
        description: "Password reset instructions sent to your email",
      });
      navigate('/auth/verify-email');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const errorMessage = error.response?.data?.error || 'Password reset request failed';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (resetData: ResetPasswordData) => {
    try {
      setError(null);
      const data = await authService.resetPassword(resetData);
      setUser({ token: data.token });
      toast({
        title: "Success",
        description: "Password reset successfully",
      });
      navigate('/auth/login');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const errorMessage = error.response?.data?.error || 'Password reset failed';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    changePassword,
    verifyEmail,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};