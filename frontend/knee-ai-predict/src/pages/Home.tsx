import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { Upload, History, Settings, User, ArrowRight, CheckCircle2, Activity, Heart, Brain, Shield, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Home = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className={`h-8 w-8 text-medical-secondary ${isRTL ? 'rtl-flip' : ''}`} />,
      title: t('home.features.items.upload.title'),
      description: t('home.features.items.upload.description')
    },
    {
      icon: <History className={`h-8 w-8 text-medical-secondary ${isRTL ? 'rtl-flip' : ''}`} />,
      title: t('home.features.items.history.title'),
      description: t('home.features.items.history.description')
    },
    {
      icon: <Settings className={`h-8 w-8 text-medical-secondary ${isRTL ? 'rtl-flip' : ''}`} />,
      title: t('home.features.items.ai.title'),
      description: t('home.features.items.ai.description')
    },
    {
      icon: <User className={`h-8 w-8 text-medical-secondary ${isRTL ? 'rtl-flip' : ''}`} />,
      title: t('home.features.items.security.title'),
      description: t('home.features.items.security.description')
    }
  ];

  const steps = [
    {
      step: "1",
      title: t('home.howItWorks.steps.upload.title'),
      description: t('home.howItWorks.steps.upload.description')
    },
    {
      step: "2",
      title: t('home.howItWorks.steps.analysis.title'),
      description: t('home.howItWorks.steps.analysis.description')
    },
    {
      step: "3",
      title: t('home.howItWorks.steps.results.title'),
      description: t('home.howItWorks.steps.results.description')
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50]/50 to-[#3498DB]/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {t('home.hero.title')}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('home.hero.subtitle')}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="relative group bg-white text-[#2C3E50] hover:bg-white/90 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate('/predict')}
              >
                <span className="relative z-10 flex items-center">
                  {t('home.hero.startButton')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#3498DB]/20 to-[#2C3E50]/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="relative group bg-transparent border-2 border-white/30 hover:border-white text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm"
                  onClick={() => navigate('/features')}
                >
                  <span className="relative z-10 flex items-center">
                    {t('home.hero.learnMoreButton')}
                    <Sparkles className="ml-2 h-5 w-5 transition-all duration-300 group-hover:rotate-12 group-hover:text-[#3498DB]" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3498DB]/20 to-[#2C3E50]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Modern Background Design */}
        <div className="absolute inset-0">
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]" />

          {/* Animated mesh gradient overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_#3498DB_0%,_transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,_#2C3E50_0%,_transparent_50%)]" />
          </div>

          {/* Medical-themed pattern overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233498DB' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />

          {/* Animated floating elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating circles */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#3498DB]/5 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#2C3E50]/5 rounded-full blur-3xl animate-float-slow animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#3498DB]/5 rounded-full blur-3xl animate-float-slow animation-delay-4000" />
          </div>

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#3498DB08_1px,transparent_1px),linear-gradient(to_bottom,#3498DB08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            {/* Decorative line with gradient */}
            <div className="inline-block mb-4">
              <div className="w-20 h-1 bg-gradient-to-r from-[#3498DB] via-[#2C3E50] to-[#3498DB] rounded-full animate-gradient-x" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 ${isRTL ? 'rtl-grid' : ''}`}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/90 backdrop-blur-md rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-[#3498DB]/10"
              >
                {/* Feature Icon Container */}
                <div className="relative mb-6">
                  {/* Background gradient circle */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3498DB]/10 to-[#2C3E50]/10 rounded-full blur-sm transform group-hover:scale-110 transition-transform duration-300" />

                  {/* Icon container */}
                  <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-white to-[#ECF0F1] rounded-full flex items-center justify-center shadow-inner">
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3498DB]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    {/* Icon */}
                    <div className={`transform transition-transform duration-300 group-hover:scale-110 ${isRTL ? 'rtl-flip' : ''}`}>
                      {feature.icon}
                    </div>
                  </div>
                </div>

                {/* Feature Content */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-3 group-hover:text-[#3498DB] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover effect line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#3498DB] to-[#2C3E50] group-hover:w-1/2 transition-all duration-300" />
              </div>
            ))}
          </div>

          {/* Additional Info Box with Glass Effect */}
          <div className="mt-16 bg-white/80 backdrop-blur-lg rounded-xl p-8 text-center max-w-3xl mx-auto shadow-xl relative overflow-hidden border border-[#3498DB]/20">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#3498DB]/10 via-[#2C3E50]/10 to-[#3498DB]/10" />

            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0">
                <Activity className="w-24 h-24 text-[#3498DB]" />
              </div>
              <div className="absolute bottom-0 right-0">
                <Heart className="w-24 h-24 text-[#2C3E50]" />
              </div>
            </div>

            <div className="relative">
              {/* Decorative line */}
              <div className="inline-block mb-4">
                <div className="w-12 h-1 bg-gradient-to-r from-[#3498DB] via-[#2C3E50] to-[#3498DB] rounded-full animate-gradient-x" />
              </div>

              <h4 className="text-xl font-semibold text-[#2C3E50] mb-4">
                {t('home.features.additionalInfo.title', 'Experience the Future of Medical Imaging')}
              </h4>
              <p className="text-gray-600 mb-6">
                {t('home.features.additionalInfo.description', 'Join thousands of healthcare professionals who trust our AI-powered platform for accurate knee osteoarthritis analysis.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="relative px-6 py-2 border-2 border-[#3498DB] text-[#3498DB] hover:text-white hover:bg-[#3498DB] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 group"
                  >
                    <span className="relative z-10">
                      {t('home.features.additionalInfo.learnMoreButton', 'Learn More About Our Features')}
                    </span>
                    <div className="absolute inset-0 bg-[#3498DB] rounded-md transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button
                    size="lg"
                    className="relative px-6 py-2 bg-gradient-to-r from-[#3498DB] to-[#2C3E50] hover:from-[#2980B9] hover:to-[#2C3E50] text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 group"
                  >
                    <span className="relative z-10">
                      {t('home.features.additionalInfo.getStartedButton', 'Get Started Now')}
                    </span>
                    <div className="absolute inset-0 bg-white/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F6FA] to-white">
          {/* Medical-themed decorative patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-10 left-10">
              <Activity className="w-24 h-24 text-[#3498DB]" />
            </div>
            <div className="absolute bottom-10 right-10">
              <Heart className="w-24 h-24 text-[#2C3E50]" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Brain className="w-32 h-32 text-[#3498DB]" />
            </div>
          </div>

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3498DB]/5 to-transparent animate-gradient-x" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="w-20 h-1 bg-[#3498DB] mx-auto rounded-full" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          <div className="relative">
            {/* Connection Line with Gradient */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#3498DB]/20 via-[#3498DB] to-[#3498DB]/20 transform -translate-y-1/2 z-0" />

            <div className={`grid md:grid-cols-3 gap-8 relative z-10 ${isRTL ? 'rtl-grid' : ''}`}>
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-[#3498DB]/10"
                >
                  {/* Step Number Circle with Gradient */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-[#3498DB] to-[#2C3E50] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                    {step.step}
                  </div>

                  {/* Step Icon with Animated Background */}
                  <div className="mt-6 mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ECF0F1] to-white rounded-full flex items-center justify-center shadow-inner relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#3498DB]/0 via-[#3498DB]/10 to-[#3498DB]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      {index === 0 ? (
                        <Upload className="h-8 w-8 text-[#3498DB] transition-transform duration-300 group-hover:scale-110" />
                      ) : index === 1 ? (
                        <Settings className="h-8 w-8 text-[#3498DB] transition-transform duration-300 group-hover:scale-110" />
                      ) : (
                        <CheckCircle2 className="h-8 w-8 text-[#3498DB] transition-transform duration-300 group-hover:scale-110" />
                      )}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-[#2C3E50] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for connection with animation */}
                  {index < steps.length && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <div className="relative">
                        <ArrowRight className={`h-6 w-6 text-[#3498DB] ${isRTL ? 'rotate-180' : ''} animate-pulse`} />
                        <div className="absolute inset-0 bg-[#3498DB] blur-sm opacity-20 animate-ping" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Connection Lines with Gradient */}
            <div className="md:hidden flex justify-center items-center space-y-4 mt-8">
              {steps.map((_, index) => (
                index < steps.length - 1 && (
                  <div key={index} className="h-8 w-0.5 bg-gradient-to-b from-[#3498DB]/20 via-[#3498DB] to-[#3498DB]/20 mx-auto" />
                )
              ))}
            </div>
          </div>
        </div>


      </section>

      {/* CTA Section */}
      <section className={`py-20 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#2C3E50] to-[#3498DB] text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <Link to="/auth/signup">
            <Button
              size="lg"
              className={`${isRTL
                ? 'bg-[#2C3E50] hover:bg-[#34495E]'
                : 'bg-[#3498DB] hover:bg-[#2980B9]'
                } text-white transition-colors duration-200 shadow-lg hover:shadow-xl`}
            >
              {t('home.cta.button')}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
