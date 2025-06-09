import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Location } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as Location<LocationState>;
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = t('errors.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = t('errors.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login({
        email: formData.email,
        password: formData.password
      });
      // Redirect to the page they tried to visit or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the auth context
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
                {t('auth.loginTitle')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('auth.welcomeBack')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
              {/* Login Form */}
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
                        {t('auth.loginTitle')}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-600">
                      {t('auth.welcomeBack')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {authError && (
                        <Alert variant="destructive">
                          <AlertDescription>{authError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#2C3E50] font-medium">
                          {t('common.email')}
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
                            placeholder={t('auth.emailPlaceholder')}
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
                          {t('common.password')}
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
                            placeholder={t('auth.passwordPlaceholder')}
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onCheckedChange={(checked) =>
                              setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                            }
                            className="border-gray-300 data-[state=checked]:bg-[#3498DB] data-[state=checked]:border-[#3498DB]"
                          />
                          <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                            {t('auth.rememberMe')}
                          </Label>
                        </div>
                        <Link
                          to="/auth/forgot-password"
                          className="text-sm text-[#3498DB] hover:text-[#2980B9] transition-colors duration-200"
                        >
                          {t('auth.forgotPasswordLink')}
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#3498DB] to-[#2C3E50] hover:from-[#2980B9] hover:to-[#2C3E50] text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <div className="flex items-center space-x-2">
                          <span>{t('common.login')}</span>
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </Button>

                      <div className="text-center text-sm text-gray-600">
                        {t('auth.noAccount')}{' '}
                        <Link
                          to="/auth/signup"
                          className="text-[#3498DB] hover:text-[#2980B9] font-medium transition-colors duration-200"
                        >
                          {t('auth.signupLink')}
                        </Link>
                      </div>
                    </form>
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
                        {t('auth.signup.benefits.security.title')}
                      </h2>
                      <p className="text-white/80 mb-8">
                        {t('auth.signup.benefits.security.description')}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          icon: <Sparkles className="h-6 w-6" />,
                          title: t('auth.signup.benefits.features.title'),
                          description: t('auth.signup.benefits.features.description')
                        },
                        {
                          icon: <Shield className="h-6 w-6" />,
                          title: t('auth.signup.benefits.support.title'),
                          description: t('auth.signup.benefits.support.description')
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

export default Login;
