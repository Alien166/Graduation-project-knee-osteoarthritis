import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Layout from '@/components/layout/Layout';
import { Mail, Phone, MapPin, Send, MessageSquare, Building2, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

    if (!formData.name.trim()) {
      newErrors.name = t('errors.required');
    }

    if (!formData.email) {
      newErrors.email = t('errors.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.invalidEmail');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('errors.required');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('errors.required');
    } else if (formData.message.length < 10) {
      newErrors.message = t('contact.errors.messageTooShort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setErrors({ general: t('errors.serverError') });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Building2 className="h-6 w-6" />,
      title: t('contact.info.company'),
      value: 'Knee AI Predict'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t('contact.info.address'),
      value: t('contact.info.addressContent')
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: t('contact.info.phone'),
      value: '+1 (555) 123-4567'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: t('contact.info.email'),
      value: 'contact@kneeai.com'
    }
  ];

  const businessHours = [
    {
      days: t('contact.hours.weekdays'),
      hours: '9:00 AM - 6:00 PM'
    },
    {
      days: t('contact.hours.weekend'),
      hours: '10:00 AM - 4:00 PM'
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
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
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-4">
                <div className="w-20 h-1 bg-gradient-to-r from-[#3498DB] via-[#2C3E50] to-[#3498DB] rounded-full animate-gradient-x" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#3498DB] bg-clip-text text-transparent mb-6">
                {t('contact.title')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('contact.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Contact Information */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Card className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-xl h-full">
                  <CardContent className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6">
                        {t('contact.info.title')}
                      </h2>
                      <div className="space-y-6">
                        {contactInfo.map((info, index) => (
                          <motion.div
                            key={index}
                            variants={fadeInUp}
                            className="flex items-start space-x-4"
                          >
                            <div className="p-3 rounded-xl bg-gradient-to-br from-[#2C3E50]/10 to-[#3498DB]/10">
                              {info.icon}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">
                                {info.title}
                              </h3>
                              <p className="text-[#2C3E50] font-medium">
                                {info.value}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6">
                        {t('contact.hours.title')}
                      </h2>
                      <div className="space-y-4">
                        {businessHours.map((schedule, index) => (
                          <motion.div
                            key={index}
                            variants={fadeInUp}
                            className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-br from-[#2C3E50]/5 to-[#3498DB]/5"
                          >
                            <div className="flex items-center space-x-3">
                              <Clock className="h-5 w-5 text-[#3498DB]" />
                              <span className="font-medium text-[#2C3E50]">
                                {schedule.days}
                              </span>
                            </div>
                            <span className="text-gray-600">
                              {schedule.hours}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-[#2C3E50] to-[#3498DB] text-white">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50]/50 to-[#3498DB]/50" />
                  </div>
                  <CardContent className="relative p-8">
                    <div className="mb-8">
                      <div className="p-3 rounded-full bg-white/10 w-fit mb-6">
                        <MessageSquare className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-semibold mb-2">
                        {t('contact.form.title')}
                      </h2>
                      <p className="text-white/80">
                        Fill out the form below and we'll get back to you as soon as possible.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {errors.general && (
                        <Alert variant="destructive" className="animate-fade-in">
                          <AlertDescription>{errors.general}</AlertDescription>
                        </Alert>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/90">
                            {t('contact.form.name')}
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`${errors.name ? 'border-white/20' : 'border-white/50'}
                              focus:ring-2 focus:ring-white focus:border-transparent
                              transition-all duration-200`}
                          />
                          {errors.name && (
                            <p className="text-sm text-white animate-fade-in">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/90">
                            {t('contact.form.email')}
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`${errors.email ? 'border-white/20' : 'border-white/50'}
                              focus:ring-2 focus:ring-white focus:border-transparent
                              transition-all duration-200`}
                          />
                          {errors.email && (
                            <p className="text-sm text-white animate-fade-in">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/90">
                          {t('contact.form.subject')}
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className={`${errors.subject ? 'border-white/20' : 'border-white/50'}
                            focus:ring-2 focus:ring-white focus:border-transparent
                            transition-all duration-200`}
                        />
                        {errors.subject && (
                          <p className="text-sm text-white animate-fade-in">
                            {errors.subject}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/90">
                          {t('contact.form.message')}
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          className={`${errors.message ? 'border-white/20' : 'border-white/50'}
                            focus:ring-2 focus:ring-white focus:border-transparent
                            transition-all duration-200 resize-none`}
                        />
                        {errors.message && (
                          <p className="text-sm text-white animate-fade-in">
                            {errors.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-white text-[#2C3E50] hover:bg-white/90 transition-colors duration-300"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{t('common.loading')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Send className="h-5 w-5" />
                            <span>{t('contact.form.submit')}</span>
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Success Message (Hidden by default) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none"
            >
              <Card className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-2xl max-w-md mx-4">
                <CardContent className="p-8 text-center">
                  <div className="p-3 rounded-full bg-green-100 w-fit mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600">
                    {t('contact.form.successMessage')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;