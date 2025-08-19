import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import FilterPanel from './components/FilterPanel';
import MetricsGrid from './components/MetricsGrid';
import ThreatTrendsChart from './components/ThreatTrendsChart';
import ThreatDistributionChart from './components/ThreatDistributionChart';
import ModelPerformanceLeaderboard from './components/ModelPerformanceLeaderboard';
import CorrelationMatrix from './components/CorrelationMatrix';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { analyzeModelPerformance, analyzeCorrelations } from '../../services/aiInsightsService';

const AnalyticsPerformanceIntelligence = () => {
  const [filters, setFilters] = useState({
    dateRange: '30d',
    threatTypes: [],
    confidenceRange: { min: 0, max: 100 },
    comparisonMode: 'period-over-period',
    customDateStart: '',
    customDateEnd: ''
  });
  
  const [metrics, setMetrics] = useState({});
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [correlationInsights, setCorrelationInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Enhanced model performance data
  const [modelPerformanceData] = useState([
    { name: 'GPT-4o', accuracy: 94.7, responseTime: 1.8, throughput: '12.3K' },
    { name: 'Custom BERT', accuracy: 92.1, responseTime: 1.2, throughput: '15.1K' },
    { name: 'Claude-3', accuracy: 91.8, responseTime: 2.1, throughput: '10.8K' },
    { name: 'Gemini Pro', accuracy: 89.4, responseTime: 1.6, throughput: '11.7K' },
    { name: 'LLaMA-2', accuracy: 87.3, responseTime: 1.4, throughput: '13.2K' }
  ]);

  // Mock data for components
  const [threatTrendsData] = useState([
    { date: '2024-01-01', malware: 120, phishing: 85, spam: 200, suspicious: 45 },
    { date: '2024-01-02', malware: 135, phishing: 92, spam: 180, suspicious: 52 },
    { date: '2024-01-03', malware: 98, phishing: 78, spam: 220, suspicious: 38 },
    { date: '2024-01-04', malware: 156, phishing: 101, spam: 195, suspicious: 61 },
    { date: '2024-01-05', malware: 142, phishing: 89, spam: 175, suspicious: 49 }
  ]);

  const [threatDistributionData] = useState([
    { name: 'Phishing', value: 35, color: '#ef4444' },
    { name: 'Malware', value: 28, color: '#f97316' },
    { name: 'Spam', value: 25, color: '#eab308' },
    { name: 'Suspicious', value: 12, color: '#06b6d4' }
  ]);

  const [correlationData] = useState([
    { metric1: 'Accuracy', metric2: 'Response Time', correlation: -0.45 },
    { metric1: 'Accuracy', metric2: 'Throughput', correlation: 0.32 },
    { metric1: 'Response Time', metric2: 'Throughput', correlation: -0.67 },
    { metric1: 'Confidence', metric2: 'Accuracy', correlation: 0.78 },
    { metric1: 'False Positive Rate', metric2: 'Accuracy', correlation: -0.82 }
  ]);

  // Auto-refresh data every 30 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      handleRefreshData();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  // Load AI analysis on component mount
  useEffect(() => {
    loadAIAnalysis();
  }, []);

  const loadAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Analyze model performance
      const performanceAnalysis = await analyzeModelPerformance(modelPerformanceData);
      setAiAnalysis(performanceAnalysis);

      // Analyze correlations
      const correlationAnalysis = await analyzeCorrelations(correlationData);
      setCorrelationInsights(correlationAnalysis);

    } catch (error) {
      console.error('Failed to load AI analysis:', error);
      // Fallback analysis
      setAiAnalysis({
        overallAssessment: 'GPT-4o leads in accuracy while Custom BERT excels in response time. Overall performance is strong across all models.',
        topPerformer: 'GPT-4o',
        recommendations: [
          'Consider load balancing between GPT-4o and Custom BERT for optimal performance',
          'Monitor Custom BERT for potential accuracy improvements',
          'Evaluate Claude-3 throughput optimization opportunities'
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Mock data refresh
  const handleRefreshData = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update metrics with slight variations
    setMetrics({
      detectionAccuracy: `${(94 + Math.random() * 2)?.toFixed(1)}%`,
      falsePositiveRate: `${(3 + Math.random())?.toFixed(1)}%`,
      processingThroughput: `${(12 + Math.random() * 2)?.toFixed(1)}K`,
      modelConfidence: `${(87 + Math.random() * 3)?.toFixed(1)}%`,
      threatEvolution: `${(6.5 + Math.random())?.toFixed(1)}/10`,
      awarenessEffectiveness: `${(78 + Math.random() * 4)?.toFixed(1)}%`
    });
    
    setLastRefresh(new Date());
    // Reload AI analysis with new data
    await loadAIAnalysis();
    setIsLoading(false);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // In a real app, this would trigger data refetch
    console.log('Filters updated:', newFilters);
  };

  const handleMetricClick = (metricId) => {
    setSelectedWidget(selectedWidget === metricId ? null : metricId);
    console.log('Metric clicked:', metricId);
  };

  const handleTrendDataClick = (dataPoint) => {
    console.log('Trend data point clicked:', dataPoint);
  };

  const handleDistributionSegmentClick = (segment) => {
    console.log('Distribution segment clicked:', segment);
  };

  const handleModelClick = (model) => {
    console.log('Model clicked:', model);
  };

  const handleCorrelationCellClick = (correlation) => {
    console.log('Correlation cell clicked:', correlation);
  };

  const exportReport = () => {
    console.log('Exporting analytics report...');
    // Mock export functionality
  };

  const formatLastRefresh = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="security-container py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Analytics & Performance Intelligence
              </h1>
              <p className="text-text-secondary">
                AI-powered threat pattern analysis and model performance tracking for data-driven security optimization
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-text-secondary">Last Updated</div>
                <div className="text-sm font-medium text-text-primary">
                  {formatLastRefresh(lastRefresh)}
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={handleRefreshData}
                loading={isLoading}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh Data
              </Button>
              
              <Button
                variant="default"
                onClick={exportReport}
                iconName="Download"
                iconPosition="left"
              >
                Export Report
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          <FilterPanel onFiltersChange={handleFiltersChange} />

          {/* Key Metrics Grid */}
          <MetricsGrid 
            metrics={metrics} 
            onMetricClick={handleMetricClick}
          />

          {/* Main Analysis Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Threat Trends Chart - Takes 2 columns on XL screens */}
            <div className="xl:col-span-2">
              <ThreatTrendsChart 
                data={threatTrendsData}
                onDataPointClick={handleTrendDataClick}
              />
            </div>

            {/* Right Panel */}
            <div className="space-y-8">
              {/* Threat Distribution */}
              <ThreatDistributionChart 
                data={threatDistributionData}
                onSegmentClick={handleDistributionSegmentClick}
              />
              
              {/* Model Performance Leaderboard */}
              <ModelPerformanceLeaderboard 
                data={modelPerformanceData}
                onModelClick={handleModelClick}
              />
            </div>
          </div>

          {/* Correlation Matrix - Full Width */}
          <CorrelationMatrix 
            data={correlationData}
            onCellClick={handleCorrelationCellClick}
          />

          {/* AI-Powered Insights Panel */}
          <div className="mt-8 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Icon name="Bot" size={20} className="mr-2" />
              AI-Generated Performance Insights
              {isAnalyzing && (
                <Icon name="Loader2" size={16} className="ml-2 animate-spin" />
              )}
            </h3>
            
            {aiAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="Award" size={16} className="text-success" />
                    <span className="font-medium text-text-primary">Overall Assessment</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {aiAnalysis?.overallAssessment}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="Crown" size={16} className="text-warning" />
                    <span className="font-medium text-text-primary">Top Performer</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {aiAnalysis?.topPerformer} is currently leading in overall performance metrics.
                  </p>
                </div>
              </div>
            )}

            {aiAnalysis?.recommendations && (
              <div className="mb-6">
                <h4 className="font-medium text-text-primary mb-3 flex items-center">
                  <Icon name="Lightbulb" size={16} className="mr-2" />
                  AI Recommendations
                </h4>
                <div className="space-y-2">
                  {aiAnalysis?.recommendations?.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Icon name="ArrowRight" size={14} className="mt-0.5 text-primary" />
                      <span className="text-sm text-text-secondary">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {correlationInsights && (
              <div className="border-t border-border pt-4">
                <h4 className="font-medium text-text-primary mb-3 flex items-center">
                  <Icon name="TrendingUp" size={16} className="mr-2" />
                  Correlation Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Strongest Correlation:</strong>
                    <p className="text-text-secondary mt-1">{correlationInsights?.strongestCorrelation}</p>
                  </div>
                  {correlationInsights?.securityImplications && (
                    <div>
                      <strong>Security Implications:</strong>
                      <ul className="text-text-secondary mt-1 space-y-1">
                        {correlationInsights?.securityImplications?.slice(0, 2)?.map((implication, index) => (
                          <li key={index} className="flex items-start space-x-1">
                            <span>•</span>
                            <span>{implication}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-text-primary">94.7%</div>
                <div className="text-xs text-text-secondary">Overall Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">56.8K</div>
                <div className="text-xs text-text-secondary">Emails Analyzed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">1,873</div>
                <div className="text-xs text-text-secondary">Threats Detected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">2.1s</div>
                <div className="text-xs text-text-secondary">Avg Response Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">5</div>
                <div className="text-xs text-text-secondary">Active Models</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">99.2%</div>
                <div className="text-xs text-text-secondary">System Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPerformanceIntelligence;