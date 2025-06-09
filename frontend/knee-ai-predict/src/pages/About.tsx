import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Activity,
  Award,
  Brain,
  CheckCircle2,
  Heart,
  Microscope,
  Shield,
  Sparkles,
  Users,
  Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: t('about.features.ai.title'),
      description: t('about.features.ai.description')
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t('about.features.security.title'),
      description: t('about.features.security.description')
    },
    {
      icon: <Microscope className="h-8 w-8" />,
      title: t('about.features.research.title'),
      description: t('about.features.research.description')
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: t('about.features.accuracy.title'),
      description: t('about.features.accuracy.description')
    }
  ];

  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      value: t('about.stats.users'),
      label: t('about.stats.usersLabel')
    },
    {
      icon: <Award className="h-8 w-8" />,
      value: t('about.stats.accuracy'),
      label: t('about.stats.accuracyLabel')
    },
    {
      icon: <Zap className="h-8 w-8" />,
      value: t('about.stats.predictions'),
      label: t('about.stats.predictionsLabel')
    }
  ];

  const team = [
    {
      name: t('about.team.members.doctor.name'),
      role: t('about.team.members.doctor.role'),
      description: t('about.team.members.doctor.description')
    },
    {
      name: t('about.team.members.ai.name'),
      role: t('about.team.members.ai.role'),
      description: t('about.team.members.ai.description')
    },
    {
      name: t('about.team.members.researcher.name'),
      role: t('about.team.members.researcher.role'),
      description: t('about.team.members.researcher.description')
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
                {t('about.hero.title')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('about.hero.subtitle')}
              </p>
            </motion.div>

            {/* Mission Section */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-[#2C3E50] to-[#3498DB] text-white">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50]/50 to-[#3498DB]/50" />
                </div>
                <CardContent className="relative p-12 text-center">
                  <div className="p-4 rounded-full bg-white/10 w-fit mx-auto mb-6">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-semibold mb-6">
                    {t('about.mission.title')}
                  </h2>
                  <p className="text-lg text-white/90 max-w-3xl mx-auto">
                    {t('about.mission.description')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="mb-20"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-3xl font-semibold text-center text-[#2C3E50] mb-12"
                variants={fadeInUp}
              >
                {t('about.features.title')}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-[#2C3E50]/10 to-[#3498DB]/10 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-[#2C3E50] mb-3">
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

            {/* Stats Section */}
            <motion.div
              className="mb-20"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-8 text-center">
                        <div className="p-4 rounded-full bg-gradient-to-br from-[#2C3E50]/10 to-[#3498DB]/10 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          {stat.icon}
                        </div>
                        <div className="text-4xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#3498DB] bg-clip-text text-transparent mb-2">
                          {stat.value}
                        </div>
                        <div className="text-gray-600">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Team Section */}
            <motion.div
              className="mb-20"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-3xl font-semibold text-center text-[#2C3E50] mb-12"
                variants={fadeInUp}
              >
                {t('about.team.title')}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {team.map((member, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                      <CardContent className="p-8">
                        <div className="p-4 rounded-full bg-gradient-to-br from-[#2C3E50]/10 to-[#3498DB]/10 w-fit mb-6">
                          <Activity className="h-8 w-8 text-[#3498DB]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
                          {member.name}
                        </h3>
                        <p className="text-[#3498DB] font-medium mb-4">
                          {member.role}
                        </p>
                        <p className="text-gray-600">
                          {member.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Technology Section */}
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
                <CardContent className="relative p-12">
                  <div className="text-center mb-8">
                    <Sparkles className="h-12 w-12 mx-auto mb-6 text-white/80" />
                    <h2 className="text-3xl font-semibold mb-4">
                      {t('about.technology.title')}
                    </h2>
                    <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8">
                      {t('about.technology.description')}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <ul className="space-y-4">
                      {Object.entries(t('about.technology.features', { returnObjects: true })).map(([key, value], index) => (
                        <motion.li
                          key={key}
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="p-1 rounded-full bg-white/20">
                            <CheckCircle2 className="h-5 w-5 text-white flex-shrink-0" />
                          </div>
                          <span className="text-white/90">{value}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <div className="relative">
                      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5" />
                      <div className="relative p-8 rounded-xl bg-white/10 backdrop-blur-sm">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Brain className="h-6 w-6 text-white/80" />
                            <span className="text-white/90">Advanced AI Models</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Activity className="h-6 w-6 text-white/80" />
                            <span className="text-white/90">Real-time Processing</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Shield className="h-6 w-6 text-white/80" />
                            <span className="text-white/90">Secure Infrastructure</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;