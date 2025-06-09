import Layout from '@/components/layout/Layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, Mail, Shield, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import VerificationInput from 'react-verification-input';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const email = localStorage.getItem('resetEmail');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      setErrors({ code: t('errors.invalidCode') });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/checkCode', {
        code,
        email, // make sure you have this in your component state
      });

      if (response.data.message === 'success') {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/auth/reset-password');
        }, 2000);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({ code: t('errors.invalidCode') });
      } else {
        setErrors({ general: t('errors.serverError') });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(60);
    } catch (error) {
      setErrors({ general: t('errors.serverError') });
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
        <div className="relative container mx-auto px-4 py-12">
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
                {t('auth.verifyEmail.title')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('auth.verifyEmail.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Verification Form */}
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
                        <Mail className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-[#2C3E50]">
                        {t('auth.verifyEmail.formTitle')}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-600">
                      {t('auth.verifyEmail.formSubtitle')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    {isSuccess ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {t('auth.verifyEmail.successTitle')}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {t('auth.verifyEmail.successMessage')}
                        </p>
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="text-[#3498DB]">{t('common.loading')}</span>
                        </div>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.general && (
                          <Alert variant="destructive" className="animate-fade-in">
                            <AlertDescription>{errors.general}</AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <VerificationInput
                              value={code}
                              onChange={(value) => {
                                console.log('Input value:', value);
                                setCode(value);
                              }}
                              length={6}
                              validChars="0-9a-zA-Z"
                              placeholder=""
                              autoFocus
                              inputProps={{
                                className: "w-12 h-12 text-center text-xl font-semibold border-2 border-gray-200 rounded-lg focus:border-[#3498DB] focus:ring-2 focus:ring-[#3498DB]/20 transition-all duration-200",
                                type: "text"
                              }}
                              containerProps={{
                                className: "flex gap-2"
                              }}
                            />
                          </div>
                          {errors.code && (
                            <p className="text-sm text-red-500 text-center animate-fade-in">
                              {errors.code}
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
                              <span>{t('auth.verifyEmail.verifyButton')}</span>
                              <ArrowRight className="h-5 w-5" />
                            </div>
                          )}
                        </Button>

                        <div className="text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-[#3498DB] hover:text-[#2980B9] hover:bg-[#3498DB]/10 transition-colors duration-200"
                            onClick={handleResendCode}
                            disabled={countdown > 0 || isLoading}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {countdown > 0
                              ? t('auth.verifyEmail.resendCountdown', { count: countdown })
                              : t('auth.verifyEmail.resend')}
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Security Section */}
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
                        {t('auth.verifyEmail.security.title')}
                      </h2>
                      <p className="text-white/80 mb-8">
                        {t('auth.verifyEmail.security.description')}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          icon: <Sparkles className="h-6 w-6" />,
                          title: t('auth.verifyEmail.security.steps.title'),
                          description: t('auth.verifyEmail.security.steps.description')
                        },
                        {
                          icon: <Shield className="h-6 w-6" />,
                          title: t('auth.verifyEmail.security.protection.title'),
                          description: t('auth.verifyEmail.security.protection.description')
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

export default VerifyEmail;