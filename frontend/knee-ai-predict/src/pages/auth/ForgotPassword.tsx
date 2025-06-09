import Layout from '@/components/layout/Layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { forgotPassword, error: authError } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError(t('errors.required'));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('errors.invalidEmail'));
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/forgetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      localStorage.setItem('resetEmail', email);
      setSuccess(true); // Show success UI
      setTimeout(() => {
        navigate('/auth/verify-email');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Network error');
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
                {t('auth.forgotPasswordTitle')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('auth.forgotPasswordDescription')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
              {/* Forgot Password Form */}
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
                        {t('auth.forgotPasswordTitle')}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-600">
                      {t('auth.forgotPasswordDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    {success ? (
                      <div className="text-center space-y-4">
                        <div className="p-3 rounded-full bg-green-100 w-fit mx-auto">
                          <Shield className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {t('auth.resetEmailSent')}
                        </h3>
                        <p className="text-gray-600">
                          {t('auth.resetEmailInstructions')}
                        </p>
                        <Link
                          to="/auth/login"
                          className="inline-flex items-center text-[#3498DB] hover:text-[#2980B9] font-medium transition-colors duration-200"
                        >
                          {t('auth.backToLogin')}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {(error || authError) && (
                          <Alert variant="destructive">
                            <AlertDescription>
                              {error || authError}
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-[#2C3E50] font-medium">
                            {t('common.email')}
                          </Label>
                          <div className="relative">
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10 focus:ring-2 focus:ring-[#3498DB] focus:border-transparent transition-all duration-200"
                              placeholder={t('auth.emailPlaceholder')}
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#3498DB] to-[#2C3E50] hover:from-[#2980B9] hover:to-[#2C3E50] text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{t('auth.sendResetLink')}</span>
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
                        {t('auth.forgotPassword.benefits.security.title')}
                      </h2>
                      <p className="text-white/80 mb-8">
                        {t('auth.forgotPassword.benefits.security.description')}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          icon: <Shield className="h-6 w-6" />,
                          title: t('auth.forgotPassword.benefits.secure.title'),
                          description: t('auth.forgotPassword.benefits.secure.description')
                        },
                        {
                          icon: <Mail className="h-6 w-6" />,
                          title: t('auth.forgotPassword.benefits.quick.title'),
                          description: t('auth.forgotPassword.benefits.quick.description')
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

export default ForgotPassword;