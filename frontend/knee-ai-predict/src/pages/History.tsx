import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { predictService } from '@/services/predict.service';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart,
  BarChart2,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Info,
  LineChart as LineChartIcon,
  PieChart,
  Printer,
  RefreshCw,
  Settings,
  Share2,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

export interface Prediction {
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
}

interface ApiPrediction {
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
}

export interface ApiResponse {
  predictions: ApiPrediction[];
  total: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

interface ChartDataPoint {
  date: string;
  confidence: number;
  severity: number;
}

const getFileName = (path: string) => {
  return path.split('/').pop() || path;
};

const History = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const navigate = useNavigate();

  const fetchPredictions = async (pageNum: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }
      const data = await predictService.getPredictionHistory(pageNum, pageSize, token) as unknown as ApiResponse;

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
      setTotal(data.total);
      setHasMore(data.hasMore);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch predictions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions(currentPage);
  }, [currentPage]);

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


  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-medical-success';
    if (confidence >= 0.8) return 'text-medical-warning';
    return 'text-medical-accent';
  };

  const getSeverityLevel = (prediction: string) => {
    switch (prediction) {
      case 'Healthy':
        return 'None';
      case 'Doubtful':
        return 'Mild';
      case 'Minimal':
        return 'Mild';
      case 'Moderate':
        return 'Moderate';
      case 'Severe':
        return 'Severe';
      default:
        return 'Unknown';
    }
  };

  const filteredPredictions = predictions.filter(prediction => {
    const matchesSearch = prediction.imagePath.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.prediction.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || prediction.prediction === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate trend analysis
  const trendAnalysis = useMemo(() => ({
    improving: predictions.filter(p => p.confidence > 0.9).length,
    declining: predictions.filter(p => p.confidence < 0.8).length,
    stable: predictions.filter(p => p.confidence >= 0.8 && p.confidence <= 0.9).length
  }), [predictions]);

  // Generate chart data
  useEffect(() => {
    const data = predictions.map(p => ({
      date: new Date(p.createdAt).toLocaleDateString(),
      confidence: p.confidence * 100, // Convert to percentage
      severity: p.prediction === 'Healthy' ? 0 :
        p.prediction === 'Doubtful' || p.prediction === 'Minimal' ? 1 :
          p.prediction === 'Moderate' ? 2 : 3
    }));
    setChartData(data);
  }, [predictions]);

  // Severity distribution data for pie chart
  const severityData = useMemo(() => {
    const severityCounts = predictions.reduce((acc, pred) => {
      const severity = getSeverityLevel(pred.prediction);
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(severityCounts).map(([name, value]) => ({
      name,
      value,
      color: name === 'None' ? '#10B981' :
        name === 'Mild' ? '#F59E0B' :
          name === 'Moderate' ? '#F97316' :
            '#EF4444'
    }));
  }, [predictions]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchPredictions(currentPage);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleExport = (type: 'pdf' | 'csv' | 'excel') => {
    // Implement export functionality
    console.log(`Exporting as ${type}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }
      // Add delete API call here
      await predictService.deletePrediction(id, token);
      // Refresh the list
      fetchPredictions(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete prediction');
    }
  };

  const handleShare = async (prediction: Prediction) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Knee Osteoarthritis Analysis Results',
          text: `Prediction: ${prediction.prediction} with ${(prediction.confidence * 100).toFixed(1)}% confidence`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleViewDetails = (prediction: Prediction) => {
    navigate(`/predictions/${prediction._id}`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('history.title')}
              </h1>
              <p className="text-sm text-gray-500">
                {t('history.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('history.refreshData')}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    {t('history.export')}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{t('history.exportFormat')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="h-4 w-4 mr-2" />
                    {t('history.pdfReport')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    <FileText className="h-4 w-4 mr-2" />
                    {t('history.csvData')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    <FileText className="h-4 w-4 mr-2" />
                    {t('history.excelSpreadsheet')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {t('history.overview')}
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              {t('history.analysis')}
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('history.details')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards with Enhanced Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <Card className="bg-gradient-to-br from-medical-primary/5 to-medical-secondary/5 border-medical-primary/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-medical-primary">
                          {predictions.length}
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              {t('history.totalPredictions')}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm text-gray-600">{t('history.totalPredictions')}</p>
                    </div>
                    <div className="p-3 rounded-full bg-medical-primary/10">
                      <FileText className="h-6 w-6 text-medical-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-medical-success/5 to-medical-success/10 border-medical-success/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-medical-success">
                        {predictions.filter(p => p.prediction === 'Healthy').length}
                      </div>
                      <p className="text-sm text-gray-600">Healthy Results</p>
                    </div>
                    <div className="p-3 rounded-full bg-medical-success/10">
                      <CheckCircle2 className="h-6 w-6 text-medical-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-medical-warning/5 to-medical-warning/10 border-medical-warning/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-medical-warning">
                        {predictions.filter(p => p.prediction === 'Doubtful').length}
                      </div>
                      <p className="text-sm text-gray-600">Doubtful Cases</p>
                    </div>
                    <div className="p-3 rounded-full bg-medical-warning/10">
                      <AlertCircle className="h-6 w-6 text-medical-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-medical-accent/5 to-medical-accent/10 border-medical-accent/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-medical-accent">
                        {predictions.filter(p => p.prediction === 'Minimal' || p.prediction === 'Moderate' || p.prediction === 'Severe').length}
                      </div>
                      <p className="text-sm text-gray-600">Moderate+ Cases</p>
                    </div>
                    <div className="p-3 rounded-full bg-medical-accent/10">
                      <AlertCircle className="h-6 w-6 text-medical-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trend Analysis Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-medical-secondary" />
                    {t('history.trendAnalysis')}
                  </CardTitle>
                  <CardDescription>
                    {t('history.detailedAnalysis')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{t('history.improvingCases')}</span>
                        <span className="text-medical-success font-medium">
                          {trendAnalysis.improving}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-medical-success rounded-full"
                          style={{ width: `${(trendAnalysis.improving / predictions.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{t('history.decliningCases')}</span>
                        <span className="text-red-500 font-medium">
                          {trendAnalysis.declining}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${(trendAnalysis.declining / predictions.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{t('history.stableCases')}</span>
                        <span className="text-gray-500 font-medium">
                          {trendAnalysis.stable}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-gray-100 rounded-full"
                          style={{ width: `${(trendAnalysis.stable / predictions.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {/* Chart Selection and Visualization */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-medical-secondary" />
                      {t('history.dataVisualization')}
                    </CardTitle>
                    <CardDescription>
                      {t('history.interactiveCharts')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={chartType === 'line' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartType('line')}
                    >
                      <LineChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === 'bar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartType('bar')}
                    >
                      <BarChart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === 'pie' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartType('pie')}
                    >
                      <PieChart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                        <XAxis dataKey="date" className="text-sm" />
                        <YAxis yAxisId="left" className="text-sm" />
                        <YAxis yAxisId="right" orientation="right" className="text-sm" />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="confidence"
                          stroke="#3498DB"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          name={t('history.confidence')}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="severity"
                          stroke="#E74C3C"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          name={t('history.severity')}
                        />
                      </LineChart>
                    ) : chartType === 'bar' ? (
                      <RechartsBarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                        <XAxis dataKey="date" className="text-sm" />
                        <YAxis className="text-sm" />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                        <Bar dataKey="confidence" fill="#3498DB" name={t('history.confidence')} />
                        <Bar dataKey="severity" fill="#E74C3C" name={t('history.severity')} />
                      </RechartsBarChart>
                    ) : (
                      <RechartsPieChart>
                        <Pie
                          data={severityData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={150}
                          label
                        >
                          {severityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                        <Legend />
                      </RechartsPieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="">
                    <div>
                      <CardTitle>{t('history.detailedAnalysis')}</CardTitle>
                      <CardDescription>
                        {t('history.comprehensiveView')}
                      </CardDescription>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        {t('history.print')}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        {t('history.viewSettings')}
                      </Button>
                    </div> */}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('history.dateTime')}</TableHead>
                          <TableHead>{t('history.result')}</TableHead>
                          <TableHead>{t('history.confidence')}</TableHead>
                          <TableHead>{t('history.severity')}</TableHead>
                          <TableHead>{t('history.status')}</TableHead>
                          <TableHead>{t('history.trend')}</TableHead>
                          <TableHead className="text-right">{t('history.actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence mode="popLayout">
                          {isLoading ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8">
                                <div className="flex items-center justify-center">
                                  <RefreshCw className="h-6 w-6 animate-spin text-medical-primary" />
                                  <span className="ml-2">Loading predictions...</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : filteredPredictions.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8">
                                <p className="text-gray-500">No predictions found</p>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredPredictions.map((prediction) => (
                              <motion.tr
                                key={prediction._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="group hover:bg-gray-50"
                              >
                                <TableCell>
                                  <div >
                                    <div className="font-medium">{new Date(prediction.createdAt).toLocaleDateString()}</div>
                                    <div className="text-sm text-gray-500">{new Date(prediction.createdAt).toLocaleTimeString()}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">

                                    {getResultBadge(prediction.prediction)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className={`font-medium ${getConfidenceColor(prediction.confidence)}`}>
                                    {(prediction.confidence * 100).toFixed(1)}%
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium">{getSeverityLevel(prediction.prediction)}</span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-medical-success" />
                                    <span className="capitalize">Completed</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {prediction.confidence > 0.9 ? (
                                      <ArrowUpRight className="h-4 w-4 text-medical-success" />
                                    ) : prediction.confidence < 0.8 ? (
                                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                                    ) : (
                                      <TrendingUp className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleViewDetails(prediction)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleShare(prediction)}
                                    >
                                      <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDelete(prediction._id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </motion.tr>
                            ))
                          )}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                    {totalPages > 1 && (
                      <div className="mt-4">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => currentPage > 1 && fetchPredictions(currentPage - 1)}
                                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                              />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => fetchPredictions(page)}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem>
                              <PaginationNext
                                onClick={() => currentPage < totalPages && fetchPredictions(currentPage + 1)}
                                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Detail Dialog */}
        <Dialog>
          <DialogContent className="max-w-4xl">
            {selectedPrediction && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-medical-primary" />
                    {t('history.predictionDetails')}
                  </DialogTitle>
                  <DialogDescription>
                    {t('history.comprehensiveView')} - {getFileName(selectedPrediction.imagePath)}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-500">{t('history.dateTime')}</h4>
                        <p>{new Date(selectedPrediction.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-500">{t('history.status')}</h4>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-medical-success" />
                          <span className="capitalize">Completed</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-500">{t('history.result')}</h4>
                        <div className="flex items-center gap-2">
                          <span>{selectedPrediction.prediction}</span>
                          {getResultBadge(selectedPrediction.prediction)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-500">{t('history.confidence')}</h4>
                        <div className="flex items-center gap-2">
                          <span className={getConfidenceColor(selectedPrediction.confidence)}>
                            {(selectedPrediction.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{t('history.trendAnalysis')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                              <XAxis dataKey="date" className="text-sm" />
                              <YAxis className="text-sm" />
                              <RechartsTooltip
                                contentStyle={{
                                  backgroundColor: 'white',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '0.5rem',
                                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="confidence"
                                stroke="#3498DB"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                name={t('history.confidence')}
                              />
                              <Line
                                type="monotone"
                                dataKey="severity"
                                stroke="#E74C3C"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                name={t('history.severity')}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{t('history.recommendations')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {/* Assuming you have a way to access recommendations */}
                          {/* For example, you can use selectedPrediction.recommendations */}
                          {/* Replace the following with actual recommendation data */}
                          <motion.li
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="flex items-start gap-2"
                          >
                            <CheckCircle2 className="h-5 w-5 text-medical-success mt-0.5" />
                            <span>Recommendation 1</span>
                          </motion.li>
                          <motion.li
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                            className="flex items-start gap-2"
                          >
                            <CheckCircle2 className="h-5 w-5 text-medical-success mt-0.5" />
                            <span>Recommendation 2</span>
                          </motion.li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default History;
