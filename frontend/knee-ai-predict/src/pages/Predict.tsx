import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Layout from '@/components/layout/Layout';
import { Upload, Image as ImageIcon, X, Loader2, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Activity, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictService, PredictionResult } from '@/services/predict.service';
import { useNavigate } from 'react-router-dom';

interface PredictionState {
  prediction: string;
  confidence: number;
  severity: string;
  predictionId: string;
}

const Predict = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionState | null>(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const selectedFile = acceptedFiles[0];

    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError(t('predict.errors.invalidFileType'));
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setError(t('predict.errors.fileTooLarge'));
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.dicom']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    try {
      // Get the token from localStorage or your auth context
      const token = localStorage.getItem('token'); // or however you store your token
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const result = await predictService.predictImage(file, token);
      setResult({
        prediction: result.prediction,
        confidence: result.confidence,
        severity: result.prediction.toLowerCase(),
        predictionId: result.predictionId
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : t('predict.errors.analysisFailed'));
    } finally {
      setIsLoading(false);
    }
  };



  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const severityColors = {
    mild: 'text-green-600',
    moderate: 'text-yellow-600',
    severe: 'text-red-600'
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
                {t('predict.title')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('predict.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
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
                        <Upload className="h-6 w-6 text-[#3498DB]" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-[#2C3E50]">
                        {t('predict.upload.title')}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-600">
                      {t('predict.upload.subtitle')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div
                      {...getRootProps()}
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                        ${isDragActive
                          ? 'border-[#3498DB] bg-[#3498DB]/5'
                          : 'border-gray-300 hover:border-[#3498DB] hover:bg-[#3498DB]/5'
                        }`}
                    >
                      <input {...getInputProps()} />
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#3498DB]/10 to-[#2C3E50]/10 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-[#3498DB]" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-[#2C3E50]">
                            {isDragActive
                              ? t('predict.upload.dragActive')
                              : t('predict.upload.dragInactive')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {t('predict.upload.supportedFormats')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive" className="mt-4 animate-fade-in">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {preview && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6"
                      >
                        <div className="relative rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-64 object-contain bg-gray-50"
                          />
                          <button
                            onClick={handleRemoveFile}
                            className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-colors duration-200"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <Button
                          onClick={handleAnalyze}
                          disabled={isLoading}
                          className="w-full mt-4 bg-gradient-to-r from-[#3498DB] to-[#2C3E50] hover:from-[#2980B9] hover:to-[#2C3E50] text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          {isLoading ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>{t('predict.analyzing')}</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Brain className="h-5 w-5" />
                              <span>{t('predict.analyze')}</span>
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Results Section */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-[#2C3E50] to-[#3498DB] text-white h-full">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50]/50 to-[#3498DB]/50" />
                  </div>
                  <CardHeader className="relative">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="p-2 rounded-lg bg-white/10">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold">
                        {t('predict.results.title')}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-white/80">
                      {t('predict.results.subtitle')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <AnimatePresence mode="wait">
                      {!result ? (
                        <motion.div
                          key="empty-state"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center h-[400px] text-center"
                        >
                          <div className="p-4 rounded-full bg-white/10 mb-4">
                            <Sparkles className="h-8 w-8 text-white/80" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">
                            {t('predict.results.empty.title')}
                          </h3>
                          <p className="text-white/60 max-w-sm">
                            {t('predict.results.empty.description')}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="results"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold">
                                {t('predict.results.prediction')}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/10
                                ${severityColors[result.severity as keyof typeof severityColors]}`}>
                                {result.prediction}
                              </span>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-white/80">
                                  {t('predict.results.confidence')}
                                </span>
                                <span className="font-semibold">
                                  {(result.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-[#3498DB] to-[#2C3E50] h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${result.confidence * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={() => navigate(`/predictions/${result.predictionId}`)}
                            className="w-full bg-gradient-to-r from-[#3498DB] to-[#2C3E50] hover:from-[#2980B9] hover:to-[#2C3E50] text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <div className="flex items-center space-x-2">
                              <span>{t('predict.results.viewDetails')}</span>
                              <ArrowRight className="h-5 w-5" />
                            </div>
                          </Button>
                          <Button
                            onClick={() => window.print()}
                            className="w-full bg-white text-[#2C3E50] hover:bg-white/90 transition-colors duration-300"
                          >
                            <div className="flex items-center space-x-2">
                              <span>{t('predict.results.downloadReport')}</span>
                              <ArrowRight className="h-5 w-5" />
                            </div>
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

export default Predict;
