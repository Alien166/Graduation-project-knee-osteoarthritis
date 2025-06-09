import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import authService from '@/services/auth.service';
import { predictService } from '@/services/predict.service';

import { motion } from 'framer-motion';
import { Activity, Calendar, ChevronRight, History, Settings, Upload, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ApiResponse, Prediction } from './History';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<{ userId: string, userName: string; userEmail: string; role?: string; }>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const fetchPredictions = async (pageNum: number) => {
    try {

      const token = localStorage.getItem('token');

      const data = await predictService.getPredictionHistory(pageNum, 3, token) as unknown as ApiResponse;

      // Transform the API response to match our Prediction interface
      const transformedPredictions: Prediction[] = data.predictions.map((pred) => ({
        _id: pred._id,
        imagePath: pred.imagePath,
        prediction: pred.prediction,
        confidence: pred.confidence,
        probabilities: pred.probabilities,
        createdAt: pred.createdAt,
        userId: pred.userId
      }));

      setPredictions(transformedPredictions);
    } catch (err) {
      console.error('Error fetching predictions:', err);
    }
  };
  useEffect(() => {
    const userDetails = authService.getUserDetails();
    fetchPredictions(1);
    setUser(userDetails);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };



  const transformedPredictions: Prediction[] = predictions.map((pred: Prediction) => ({
    _id: pred._id,
    imagePath: pred.imagePath,
    prediction: pred.prediction,
    confidence: pred.confidence,
    probabilities: pred.probabilities,
    createdAt: pred.createdAt,
    userId: pred.userId,
  }));

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'none':
        return 'bg-emerald-500';
      case 'mild':
        return 'bg-amber-500';
      case 'moderate':
        return 'bg-orange-500';
      case 'severe':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-white to-slate-50">
        {/* Subtle background patterns */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#f0f9ff_1px,transparent_1px),linear-gradient(to_bottom,#f0f9ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-100">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%,transparent_75%,#f8fafc_75%,#f8fafc),linear-gradient(45deg,#f8fafc_25%,transparent_25%,transparent_75%,#f8fafc_75%,#f8fafc)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] opacity-50" />

              <div className="relative p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h1 className="text-4xl font-bold text-primary">
                        {t('dashboard.welcome.title', { name: user?.userName || 'User' })}
                      </h1>
                      <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
                        {t('dashboard.welcome.description')}
                      </p>
                    </div>
                    {/* <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm text-slate-600">{t('dashboard.welcome.lastLogin')}</span>
                      </div>
                      <span className="text-sm font-medium text-primary">2 hours ago</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative">
              <Card className="relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white shadow-lg">
                {/* Subtle diagonal pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%,#f1f5f9),linear-gradient(135deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%,#f1f5f9)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] opacity-30" />

                <CardContent className="relative p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-primary">
                          {t('dashboard.quickActions.title')}
                        </h2>
                        <p className="text-slate-600 text-lg max-w-xl leading-relaxed">
                          {t('dashboard.quickActions.description')}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <Link to="/predict">
                          <Button
                            size="lg"
                            className="bg-primary text-white hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md px-8 py-6 text-base font-medium rounded-xl"
                          >
                            <Upload className="mr-2 h-5 w-5" />
                            {t('dashboard.quickActions.uploadButton')}
                          </Button>
                        </Link>
                        <Link to="/history">
                          <Button
                            size="lg"
                            variant="outline"
                            className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 px-8 py-6 text-base font-medium rounded-xl"
                          >
                            <History className="mr-2 h-5 w-5" />
                            {t('dashboard.quickActions.viewHistory')}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>



          {/* Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Predictions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-2xl">
                <CardHeader className="border-b border-slate-200/50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Recent Predictions
                      </CardTitle>
                      <CardDescription className="text-slate-500 mt-1">
                        Your latest osteoarthritis analysis results
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {transformedPredictions.map((prediction) => (
                      <div
                        key={prediction._id}
                        className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-primary/20 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${getSeverityColor(prediction.prediction)} ring-4 ${getSeverityColor(prediction.prediction)}/20`} />
                            <p className="font-semibold text-slate-900 group-hover:text-primary transition-colors duration-200">
                              {prediction.prediction.charAt(0).toUpperCase() + prediction.prediction.slice(1)}
                            </p>
                          </div>
                          <p className="text-sm text-slate-500 mt-1.5">
                            {new Date(prediction.createdAt).toLocaleDateString()} •{Math.round(prediction.confidence * 100)}% confidence
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors duration-200" />
                      </div>
                    ))}
                  </div>
                  <Link to="/history">
                    <Button
                      variant="outline"
                      className="w-full mt-6 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                    >
                      View All Predictions
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-2xl">
                <CardHeader className="border-b border-slate-200/50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Quick Links
                      </CardTitle>
                      <CardDescription className="text-slate-500 mt-1">
                        Commonly used features and settings
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {[
                      { icon: Upload, text: 'New Prediction', link: '/predict' },
                      { icon: History, text: 'Prediction History', link: '/history' },
                    ].map((action, index) => (
                      <Link key={index} to={action.link}>
                        <Button
                          variant="outline"
                          className="w-full justify-start group hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 p-4 rounded-xl"
                        >
                          <div className={`p-2 rounded-lg bg-primary/10 mr-3`}>
                            <action.icon className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-medium text-slate-900 group-hover:text-primary transition-colors duration-200">
                            {action.text}
                          </span>
                          <ChevronRight className="ml-auto h-4 w-4 text-slate-400 group-hover:text-primary transition-colors duration-200" />
                        </Button>
                      </Link>
                    ))}
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

export default Dashboard;
