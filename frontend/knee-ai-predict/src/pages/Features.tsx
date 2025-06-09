import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import {
  Brain,
  Shield,
  Microscope,
  LineChart,
  Upload,
  History,
  Zap,
  Lock,
  BarChart,
  FileText,
  Users,
  Globe,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Activity,
  Award,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Features = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeTab, setActiveTab] = useState('ai');

  const mainFeatures = [
    {
      id: 'ai',
      icon: <Brain className="h-8 w-8" />,
      title: t('features.main.ai.title'),
      description: t('features.main.ai.description'),
      benefits: [
        t('features.main.ai.benefits.accuracy'),
        t('features.main.ai.benefits.speed'),
        t('features.main.ai.benefits.learning')
      ]
    },
    {
      id: 'security',
      icon: <Shield className="h-8 w-8" />,
      title: t('features.main.security.title'),
      description: t('features.main.security.description'),
      benefits: [
        t('features.main.security.benefits.encryption'),
        t('features.main.security.benefits.compliance'),
        t('features.main.security.benefits.privacy')
      ]
    },
    {
      id: 'research',
      icon: <Microscope className="h-8 w-8" />,
      title: t('features.main.research.title'),
      description: t('features.main.research.description'),
      benefits: [
        t('features.main.research.benefits.validation'),
        t('features.main.research.benefits.collaboration'),
        t('features.main.research.benefits.innovation')
      ]
    }
  ];

  const platformFeatures = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: t('features.platform.upload.title'),
      description: t('features.platform.upload.description')
    },
    {
      icon: <History className="h-6 w-6" />,
      title: t('features.platform.history.title'),
      description: t('features.platform.history.description')
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: t('features.platform.analytics.title'),
      description: t('features.platform.analytics.description')
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: t('features.platform.reports.title'),
      description: t('features.platform.reports.description')
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t('features.platform.collaboration.title'),
      description: t('features.platform.collaboration.description')
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t('features.platform.multilingual.title'),
      description: t('features.platform.multilingual.description')
    }
  ];

  const technicalFeatures = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: t('features.technical.performance.title'),
      description: t('features.technical.performance.description')
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: t('features.technical.security.title'),
      description: t('features.technical.security.description')
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: t('features.technical.reliability.title'),
      description: t('features.technical.reliability.description')
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: t('features.technical.compliance.title'),
      description: t('features.technical.compliance.description')
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
      {/* Main Background with Pattern */}
      <div className="relative min-h-screen bg-gradient-to-br from-[#F8F9FC] via-[#F0F2F8] to-[#F8F9FC]">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.8))]" />

        {/* Content Container */}
        <div className="relative py-12 px-4 sm:px-6 lg:px-8">
          {/* Hero Section with Enhanced Background */}
          <div className={`relative overflow-hidden rounded-3xl ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#2C3E50] to-[#3498DB] text-white mb-16`}>
            {/* Hero Background Pattern */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50]/50 to-[#3498DB]/50" />
            </div>

            <div className="relative px-6 py-24 sm:px-12 sm:py-32 lg:px-16 lg:py-40">
              <motion.div
                className="text-center max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
                  {t('features.hero.title')}
                </h1>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  {t('features.hero.subtitle')}
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-[#2C3E50] hover:bg-[#ECF0F1] hover:text-[#3498DB] transition-colors duration-200 shadow-md"
                  >
                    {t('features.cta.button')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Main Features Tabs with Enhanced Background */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  className="inline-block mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-20 h-1 bg-gradient-to-r from-[#3498DB] via-[#2C3E50] to-[#3498DB] rounded-full animate-gradient-x" />
                </motion.div>
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {t('features.main.title')}
                </motion.h2>
                <motion.p
                  className="text-lg text-gray-600 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {t('features.main.subtitle')}
                </motion.p>
              </div>

              <Tabs defaultValue="ai" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8 p-1.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100">
                  {mainFeatures.map((feature) => (
                    <TabsTrigger
                      key={feature.id}
                      value={feature.id}
                      className={cn(
                        "relative overflow-hidden rounded-lg transition-all duration-300",
                        "data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2C3E50] data-[state=active]:to-[#3498DB] data-[state=active]:text-white",
                        "hover:bg-white/80 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-[#2C3E50] data-[state=active]:hover:to-[#3498DB]",
                        "group"
                      )}
                    >
                      <div className="relative z-10 flex items-center justify-center space-x-2 p-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-all duration-300",
                          "group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white",
                          "group-hover:scale-110"
                        )}>
                          {feature.icon}
                        </div>
                        <span className="font-semibold">{feature.title}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#2C3E50]/0 via-[#3498DB]/0 to-[#2C3E50]/0 group-data-[state=active]:from-[#2C3E50]/20 group-data-[state=active]:via-[#3498DB]/20 group-data-[state=active]:to-[#2C3E50]/20 transition-all duration-300" />
                    </TabsTrigger>
                  ))}
                </TabsList>

                {mainFeatures.map((feature) => (
                  <TabsContent key={feature.id} value={feature.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-0">
                          <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="p-8">
                              <div className="flex items-center space-x-4 mb-6">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-[#2C3E50]/10 to-[#3498DB]/10 group-hover:scale-110 transition-transform duration-300">
                                  {feature.icon}
                                </div>
                                <h3 className="text-2xl font-semibold bg-gradient-to-r from-[#2C3E50] to-[#3498DB] bg-clip-text text-transparent">
                                  {feature.title}
                                </h3>
                              </div>
                              <p className="text-gray-600 mb-8 leading-relaxed">
                                {feature.description}
                              </p>
                              <ul className="space-y-4">
                                {feature.benefits.map((benefit, index) => (
                                  <motion.li
                                    key={index}
                                    className="flex items-start space-x-3 group/item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                  >
                                    <div className="p-1 rounded-full bg-gradient-to-br from-[#2C3E50]/10 to-[#3498DB]/10 group-hover/item:scale-110 transition-transform duration-300">
                                      <CheckCircle2 className="h-5 w-5 text-[#3498DB] flex-shrink-0" />
                                    </div>
                                    <span className="text-gray-600 group-hover/item:text-[#2C3E50] transition-colors duration-300">
                                      {benefit}
                                    </span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                            <div className="relative h-full min-h-[400px] bg-gradient-to-br from-[#2C3E50]/5 to-[#3498DB]/5 p-8 flex items-center justify-center overflow-hidden">
                              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5" />
                              <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50]/5 to-[#3498DB]/5" />
                              <div className="relative z-10">
                                <div className="p-8 rounded-full bg-gradient-to-br from-[#2C3E50]/10 to-[#3498DB]/10 group-hover:scale-110 transition-transform duration-500">
                                  {feature.icon}
                                </div>
                              </div>
                              {/* Decorative circles */}
                              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#3498DB]/5 rounded-full blur-2xl animate-float-slow" />
                              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[#2C3E50]/5 rounded-full blur-2xl animate-float-slow animation-delay-2000" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>

            {/* Platform Features Grid with Enhanced Background */}
            <motion.div
              className="mb-20"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-3xl font-semibold text-center text-medical-primary mb-12"
                variants={fadeInUp}
              >
                {t('features.platform.title')}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {platformFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-medical-primary/10 to-medical-secondary/10 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-medical-primary mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Technical Features with Enhanced Background */}
            <motion.div
              className="mb-20"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-3xl font-semibold text-center text-medical-primary mb-12"
                variants={fadeInUp}
              >
                {t('features.technical.title')}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {technicalFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-medical-primary/10 to-medical-secondary/10">
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-medical-primary mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced CTA Section with Better Background */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`relative overflow-hidden ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#2C3E50] to-[#3498DB] text-white`}>
                {/* CTA Background Pattern */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50]/50 to-[#3498DB]/50" />
                </div>
                <CardContent className="relative p-12 text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-6 text-white/80" />
                  <h2 className="text-3xl font-semibold mb-4 drop-shadow-sm">
                    {t('features.cta.title')}
                  </h2>
                  <p className="mb-8 max-w-2xl mx-auto text-lg text-blue-100">
                    {t('features.cta.description')}
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-[#2C3E50] hover:bg-[#ECF0F1] hover:text-[#3498DB] transition-colors duration-200 shadow-md"
                  >
                    {t('features.cta.button')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Features;