import Layout from '@/components/layout/Layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { predictService } from '@/services/predict.service';
import { motion } from 'framer-motion';
import { Activity, AlertCircle, AlertTriangle, ArrowLeft, Brain, ChevronRight, FileText, Heart, Image as ImageIcon, Info, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Add API response type
interface ApiResponse {
  _id: string;
  imagePath: string;
  prediction: string;
  confidence: number;
  probabilities: {
    Healthy: number;
    Doubtful: number;
    Minimal: number;
    Moderate: number;
    Severe: number;
  };
  createdAt: string;
  userId: string;
  heatmap_image?: string;
}

interface PredictionData {
  id: string;
  date: string;
  result: string;
  probabilities: {
    Healthy: number;
    Doubtful: number;
    Minimal: number;
    Moderate: number;
    Severe: number;
  };
  confidence: number;
  displayImageUrl: string;
  heatmapImage?: string;
  details: {
    severity: string;
  };
}

const getImageUrl = (imagePath: string) => {
  const filename = imagePath.split(/[/\\]/).pop() || imagePath;
  console.log('Extracted filename:', filename);
  return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/uploads/${filename}`;
};

export default function PredictionItem() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please login again.');
          return;
        }

        const response = await predictService.getPredictionById(id!, token) as ApiResponse;
        if (!response) {
          throw new Error('Failed to fetch prediction');
        }

        // Transform the API response to match our PredictionData interface
        const transformedData: PredictionData = {
          id: response._id,
          date: response.createdAt,
          result: response.prediction,
          confidence: response.confidence,
          displayImageUrl: getImageUrl(response.imagePath),
          probabilities: response.probabilities,
          heatmapImage: response.heatmap_image || undefined,
          details: {
            severity: response.prediction,
            ...getRecommendationAndNotes(response.prediction)
          }
        };

        setPrediction(transformedData);
      } catch (err) {
        console.error('Error fetching prediction:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch prediction details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPrediction();
    }
  }, [id]);

  const getResultBadge = (prediction: string) => {
    switch (prediction) {
      case 'Healthy':
        return <Badge className={`${probabilityColors.Healthy} text-white`}>{t('prediction.healthy')}</Badge>;
      case 'Doubtful':
        return <Badge className={`${probabilityColors.Doubtful} text-white`}>{t('prediction.doubtful')}</Badge>;
      case 'Minimal':
        return <Badge className={`${probabilityColors.Minimal} text-white`}>{t('prediction.minimal')}</Badge>;
      case 'Moderate':
        return <Badge className={`${probabilityColors.Moderate} text-white`}>{t('prediction.moderate')}</Badge>;
      case 'Severe':
        return <Badge className={`${probabilityColors.Severe} text-white`}>{t('prediction.severe')}</Badge>;
      default:
        return <Badge className={`${probabilityColors.Unknown} text-white`}>{t('prediction.unknown')}</Badge>;
    }
  };
  const probabilityColors: Record<string, string> = {
    Healthy: "bg-green-500",
    Doubtful: "bg-yellow-500",
    Minimal: "bg-amber-700",
    Moderate: "bg-orange-500",
    Severe: "bg-red-600",
    Unknown: "bg-gray-500",
  }

  const getRecommendationAndNotes = (severity: string) => {
    switch (severity) {
      case 'Healthy':
        return {
          recommendations: [
            t('prediction.recommendationsItem.healthy.exercise'),
            t('prediction.recommendationsItem.healthy.diet'),
          ],
          notes: t('prediction.notesItem.healthy')
        };

      case 'Doubtful':
        return {
          recommendations: [
            t('prediction.recommendationsItem.doubtful.monitor'),
            t('prediction.recommendationsItem.doubtful.followup'),
          ],
          notes: t('prediction.notesItem.doubtful')
        };

      case 'Minimal':
        return {
          recommendations: [
            t('prediction.recommendationsItem.minimal.physiotherapy'),
            t('prediction.recommendationsItem.minimal.medication'),
          ],
          notes: t('prediction.notesItem.minimal')
        };

      case 'Moderate':
        return {
          recommendations: [
            t('prediction.recommendationsItem.moderate.consult'),
            t('prediction.recommendationsItem.moderate.support'),
          ],
          notes: t('prediction.notesItem.moderate')
        };

      case 'Severe':
        return {
          recommendations: [
            t('prediction.recommendationsItem.severe.treatment'),
            t('prediction.recommendationsItem.severe.assistance'),
          ],
          notes: t('prediction.notesItem.severe')
        };

      default:
        return {
          recommendations: [t('prediction.recommendationsItem.general')],
          notes: t('prediction.notesItem.general')
        };
    }
  }


  const handleShare = async () => {
    if (navigator.share && prediction) {
      try {
        await navigator.share({
          title: 'Knee Osteoarthritis Analysis Results',
          text: `Prediction: ${prediction.result} with ${(prediction.confidence * 100).toFixed(1)}% confidence`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleExport = async (type: 'pdf' | 'image') => {
    const original = document.getElementById('exportSection');
    if (!original) return;

    // Clone the element
    const clone = original.cloneNode(true) as HTMLElement;

    // Force single-column layout for the clone
    clone.style.display = 'block'; // override grid

    if (type === 'image') clone.style.width = "200%"
    else clone.style.width = '100%';

    clone.className = ''; // remove Tailwind grid classes
    clone.style.padding = '1rem';

    // Hide the clone visually but keep it in the DOM
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';

    document.body.appendChild(clone);

    // Wait for DOM to update
    await new Promise((res) => setTimeout(res, 100));

    const canvas = await html2canvas(clone);
    const imageData = canvas.toDataURL('image/png');
    if (type === 'image') {
      const imageWindow = window.open('');
      if (imageWindow) {
        imageWindow.document.write(`<img src="${imageData}" alt="Exported Image"/>`);
        imageWindow.document.title = "Exported Image";
      } else {
        alert('Popup blocked! Please allow popups for this site.');
      }
    } else {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });
      const imgProps = pdf.getImageProperties(imageData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('exported-document.pdf');
    }

    // Clean up the clone
    document.body.removeChild(clone);
  };


  // const handleImageError = () => {
  //   setImageError(true);
  // };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-[400px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('common.error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
        </div>
      </Layout>
    );
  }

  if (!prediction) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" >
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.back')}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('prediction.details')}
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date(prediction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    {t('common.share')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    {t('common.shareLink')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="mr-2 h-4 w-4" />
                    {t('common.exportPDF')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('image')}>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {t('common.exportImage')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>

          <div className={`grid gap-8 ${isExporting ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`} id="exportSection">
            {/* Image and Heatmap Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="grid grid-cols-1 gap-6">


                {/* Heatmap Visualization Card */}
                <Card className="overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b py-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Brain className="h-4 w-4 text-medical-primary" />
                      <span>AI Analysis Areas</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3.5 w-3.5 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Red areas indicate regions where the AI model detected potential issues
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative w-full overflow-hidden bg-gray-100">
                      {prediction.heatmapImage ? (
                        <div className="relative w-full h-[400px]">
                          <motion.img
                            src={`data:image/png;base64,${prediction.heatmapImage}`}
                            alt="AI Analysis Areas"
                            className="absolute inset-0 w-full h-full object-contain"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-sm font-medium text-gray-700">Areas of concern</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50">
                          <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Analysis visualization not available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            {/* Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >

              <Card className="h-full border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow " >
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-medical-primary" />
                    {t('prediction.analysis')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex gap-2 items-center">
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-medical-primary" />
                        {t('prediction.severity')}:
                      </h3>
                      <p className="text-lg mt-1">{getResultBadge(prediction.details.severity)}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center  flex-nowrap  gap-2">
                        <Activity className="h-4 w-4 text-medical-primary" />
                        {t('prediction.confidence')}
                      </h3>
                      <div className="mt-2">
                        <Progress value={prediction.confidence * 100} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-1">
                          {(prediction.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-medical-primary" />
                    {t('prediction.urgentRecommendations')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-medical-primary" />
                        {t('prediction.recommendations')}
                      </h3>
                      <ul className="mt-2 space-y-3">
                        {getRecommendationAndNotes(prediction.details.severity).recommendations.map((rec, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <div className="w-2 h-2 rounded-full bg-medical-primary mt-2" />
                            <span className="text-gray-700">{rec}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4 text-medical-primary" />
                        {t('prediction.notes')}
                      </h3>
                      <p className="text-sm mt-1 text-gray-700">{getRecommendationAndNotes(prediction.details.severity).notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* First Card: Prediction Results */}
              <Card className="h-full border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-medical-primary" />
                    {t('prediction.details')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Heart className="h-4 w-4 text-medical-primary" />
                          {t('prediction.result')}
                        </h3>
                      </div>
                      <div className='w-full'>
                        {Object.entries(prediction.probabilities)
                          .sort((a, b) => b[1] - a[1])
                          .map(([label, prob]) => (
                            <div key={label} className="mb-4">
                              <p className="text-sm text-muted-foreground">{t(`prediction.${label.toLowerCase()}`)}</p>
                              <Progress
                                value={prob * 100}
                                indicatorColor={probabilityColors[label] || "bg-gray-400"}
                                className="h-2"
                              />
                              <p className="text-sm text-muted-foreground mt-1">
                                {(prob * 100).toFixed(1)}%
                              </p>
                            </div>
                          ))}
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
}