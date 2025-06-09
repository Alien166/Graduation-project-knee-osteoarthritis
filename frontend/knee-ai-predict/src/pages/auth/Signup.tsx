import Layout from '@/components/layout/Layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Eye, EyeOff, Lock, Mail, Shield, Sparkles, User } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t('errors.required');
    }

    if (!formData.email) {
      newErrors.email = t('errors.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = t('errors.required');
    } else if (formData.password.length < 8) {
      newErrors.password = t('errors.invalidPassword');
    }

    if (!formData.rePassword) {
      newErrors.confirmPassword = t('errors.required');
    } else if (formData.password !== formData.rePassword) {
      newErrors.confirmPassword = t('errors.passwordMismatch');
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // e.g., { name, email, password, rePassword, role }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Signup success, redirect or show message
      navigate('/auth/login');
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }

  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-gradient-to-br from-[#F8F9FC] via-[#F0F2F8] to-[#F8F9FC]">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.8))]" />

        {/* Content Container */}
        <div className="relative py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-4">
                <div className="w-20 h-1 bg-gradient-to-r from-[#3498DB] via-[#2C3E50] to-[#3498DB] rounded-full animate-gradient-x" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#3498DB] bg-clip-text text-transparent mb-6">
                {t('auth.signup.title')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('auth.signup.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
              {/* Sign Up Form */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="relative"
              >
                <Card className="relative overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-100 shadow-xl">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3498DB]/5 to-[#2C3E50]/5" />
                  </div>
                  <CardHeader className="relative">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-[#3498DB]/10 to-[#2C3E50]/10">
                        <User className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-[#2C3E50]">
                        {t('auth.signup.formTitle')}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-600">
                      {t('auth.signup.formSubtitle')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {errors.general && (
                        <Alert variant="destructive" className="animate-fade-in">
                          <AlertDescription>{errors.general}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#2C3E50] font-medium">
                          {t('auth.signup.name')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`pl-10 ${errors.name ? 'border-red-500' : 'border-gray-200'}
                              focus:ring-2 focus:ring-[#3498DB] focus:border-transparent
                              transition-all duration-200`}
                            placeholder={t('auth.signup.namePlaceholder')}
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        {errors.name && (
                          <p className="text-sm text-red-500 animate-fade-in">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#2C3E50] font-medium">
                          {t('auth.signup.email')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`pl-10 ${errors.email ? 'border-red-500' : 'border-gray-200'}
                              focus:ring-2 focus:ring-[#3498DB] focus:border-transparent
                              transition-all duration-200`}
                            placeholder={t('auth.signup.emailPlaceholder')}
                          />
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-red-500 animate-fade-in">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-[#2C3E50] font-medium">
                          {t('auth.signup.password')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : 'border-gray-200'}
                              focus:ring-2 focus:ring-[#3498DB] focus:border-transparent
                              transition-all duration-200`}
                            placeholder={t('auth.signup.passwordPlaceholder')}
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#3498DB] transition-colors duration-200"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-500 animate-fade-in">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-[#2C3E50] font-medium">
                          {t('auth.signup.confirmPassword')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="rePassword"
                            name="rePassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.rePassword}
                            onChange={handleChange}
                            className={`pl-10 pr-10 ${errors.rePassword ? 'border-red-500' : 'border-gray-200'}
                              focus:ring-2 focus:ring-[#3498DB] focus:border-transparent
                              transition-all duration-200`}
                            placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#3498DB] transition-colors duration-200"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-500 animate-fade-in">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#3498DB] to-[#2C3E50] hover:from-[#2980B9] hover:to-[#2C3E50] text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{t('common.loading')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>{t('auth.signup.submit')}</span>
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        )}
                      </Button>

                      <div className="text-center text-sm text-gray-600">
                        {t('auth.signup.haveAccount')}{' '}
                        <Link
                          to="/auth/login"
                          className="text-[#3498DB] hover:text-[#2980B9] font-medium transition-colors duration-200"
                        >
                          {t('auth.signup.loginLink')}
                        </Link>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Benefits Section */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-[#2C3E50] to-[#3498DB] text-white">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50]/50 to-[#3498DB]/50" />
                  </div>
                  <CardContent className="relative p-8">
                    <div className="mb-8">
                      <div className="p-3 rounded-full bg-white/10 w-fit mb-6">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-semibold mb-4">
                        {t('auth.signup.benefits.title')}
                      </h2>
                      <p className="text-white/80 mb-8">
                        {t('auth.signup.benefits.subtitle')}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          icon: <Shield className="h-6 w-6" />,
                          title: t('auth.signup.benefits.security.title'),
                          description: t('auth.signup.benefits.security.description')
                        },
                        {
                          icon: <Sparkles className="h-6 w-6" />,
                          title: t('auth.signup.benefits.features.title'),
                          description: t('auth.signup.benefits.features.description')
                        },
                        {
                          icon: <User className="h-6 w-6" />,
                          title: t('auth.signup.benefits.support.title'),
                          description: t('auth.signup.benefits.support.description')
                        }
                      ].map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-start space-x-4"
                        >
                          <div className="p-3 rounded-xl bg-white/10">
                            {benefit.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">
                              {benefit.title}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {benefit.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
