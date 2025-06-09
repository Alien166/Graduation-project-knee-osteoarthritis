import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    reNewPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword, error: authError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.newPassword) {
      newErrors.newPassword = t('errors.required');
    } else if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(formData.newPassword)) {
      newErrors.newPassword = t('errors.invalidPassword');
    }

    if (!formData.reNewPassword) {
      newErrors.reNewPassword = t('errors.required');
    } else if (formData.reNewPassword !== formData.reNewPassword) {
      newErrors.reNewPassword = t('errors.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const email = localStorage.getItem('resetEmail');
    if (!email) {
      setErrors({ general: t('errors.missingEmail') || 'Email not found in storage' });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          newPassword: formData.newPassword,
          reNewPassword: formData.reNewPassword
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setSuccess(true);
      setTimeout(() => {
        localStorage.removeItem('resetEmail');
        navigate('/auth/login');
      }, 3000);
    } catch (err) {
      setErrors({ general: err.message });
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
                {t('auth.resetPasswordTitle')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('auth.resetPasswordDescription')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
              {/* Reset Password Form */}
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
                        <Shield className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-[#2C3E50]">
                        {t('auth.resetPasswordTitle')}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-600">
                      {t('auth.resetPasswordDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    {success ? (
                      <div className="text-center space-y-4">
                        <div className="p-3 rounded-full bg-green-100 w-fit mx-auto">
                          <Shield className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {t('auth.passwordResetSuccess')}
                        </h3>
                        <p className="text-gray-600">
                          {t('auth.passwordResetRedirect')}
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {(errors.general || authError) && (
                          <Alert variant="destructive">
                            <AlertDescription>
                              {errors.general || authError}
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-[#2C3E50] font-medium">
                            {t('common.newPassword')}
                          </Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={showPassword ? 'text' : 'password'}
                              value={formData.newPassword}
                              onChange={handleChange}
                              className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : 'border-gray-200'}
                                focus:ring-2 focus:ring-[#3498DB] focus:border-transparent
                                transition-all duration-200`}
                              placeholder={t('auth.newPasswordPlaceholder')}
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
                          {errors.newPassword && (
                            <p className="text-sm text-red-500 animate-fade-in">
                              {errors.newPassword}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reNewPassword" className="text-[#2C3E50] font-medium">
                            {t('auth.confirmNewPassword')}
                          </Label>
                          <div className="relative">
                            <Input
                              id="reNewPassword"
                              name="reNewPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={formData.reNewPassword}
                              onChange={handleChange}
                              className={`pl-10 pr-10 ${errors.reNewPassword ? 'border-red-500' : 'border-gray-200'}
                                focus:ring-2 focus:ring-[#3498DB] focus:border-transparent
                                transition-all duration-200`}
                              placeholder={t('auth.confirmNewPasswordPlaceholder')}
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
                          {errors.reNewPassword && (
                            <p className="text-sm text-red-500 animate-fade-in">
                              {errors.reNewPassword}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#3498DB] to-[#2C3E50] hover:from-[#2980B9] hover:to-[#2C3E50] text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{t('auth.resetPassword.title')}</span>
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        </Button>

                        <div className="text-center text-sm text-gray-600">
                          {t('auth.rememberPassword')}{' '}
                          <Link
                            to="/auth/login"
                            className="text-[#3498DB] hover:text-[#2980B9] font-medium transition-colors duration-200"
                          >
                            {t('auth.backToLogin')}
                          </Link>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Features Section */}
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
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-semibold mb-4">
                        {t('auth.resetPassword.benefits.security.title')}
                      </h2>
                      <p className="text-white/80 mb-8">
                        {t('auth.resetPassword.benefits.security.description')}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          icon: <Shield className="h-6 w-6" />,
                          title: t('auth.resetPassword.benefits.secure.title'),
                          description: t('auth.resetPassword.benefits.secure.description')
                        },
                        {
                          icon: <Lock className="h-6 w-6" />,
                          title: t('auth.resetPassword.benefits.protection.title'),
                          description: t('auth.resetPassword.benefits.protection.description')
                        }
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-start space-x-4"
                        >
                          <div className="p-3 rounded-xl bg-white/10">
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">
                              {feature.title}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {feature.description}
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

export default ResetPassword;