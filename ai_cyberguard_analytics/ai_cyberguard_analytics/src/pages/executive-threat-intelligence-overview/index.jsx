import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import KPICard from './components/KPICard';
import ThreatVolumeChart from './components/ThreatVolumeChart';
import ThreatDistributionChart from './components/ThreatDistributionChart';

import ThreatHeatmap from './components/ThreatHeatmap';
import ExportControls from './components/ExportControls';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import { generateSecurityInsights, analyzeThreatContent } from '../../services/threatAnalysisService';

const ExecutiveThreatIntelligenceOverview = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [organizationUnit, setOrganizationUnit] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Mock data for KPI cards
  const kpiData = [
    {
      title: "Total Emails Processed",
      value: 2847293,
      change: 12.5,
      changeType: "positive",
      icon: "Mail",
      sparklineData: [2100000, 2200000, 2350000, 2500000, 2650000, 2750000, 2847293]
    },
    {
      title: "Threat Detection Rate",
      value: "3.2",
      unit: "%",
      change: -0.8,
      changeType: "positive",
      icon: "Shield",
      sparklineData: [4.1, 3.9, 3.7, 3.5, 3.4, 3.3, 3.2]
    },
    {
      title: "Security Posture Score",
      value: 94,
      unit: "/100",
      change: 2.1,
      changeType: "positive",
      icon: "TrendingUp",
      sparklineData: [89, 90, 91, 92, 93, 93.5, 94]
    },
    {
      title: "Cost Avoidance",
      value: "$2.4M",
      change: 18.3,
      changeType: "positive",
      icon: "DollarSign",
      sparklineData: [1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4]
    }
  ];

  // Mock data for threat volume chart
  const threatVolumeData = [
    { timestamp: "2025-01-15", emailVolume: 95420, threatPercentage: 3.8 },
    { timestamp: "2025-01-16", emailVolume: 102340, threatPercentage: 4.2 },
    { timestamp: "2025-01-17", emailVolume: 87650, threatPercentage: 2.9 },
    { timestamp: "2025-01-18", emailVolume: 98750, threatPercentage: 3.5 },
    { timestamp: "2025-01-19", emailVolume: 105230, threatPercentage: 3.1 },
    { timestamp: "2025-01-20", emailVolume: 89340, threatPercentage: 2.7 },
    { timestamp: "2025-01-21", emailVolume: 112450, threatPercentage: 4.1 },
    { timestamp: "2025-01-22", emailVolume: 98670, threatPercentage: 3.3 },
    { timestamp: "2025-01-23", emailVolume: 103890, threatPercentage: 3.7 },
    { timestamp: "2025-01-24", emailVolume: 96540, threatPercentage: 3.0 },
    { timestamp: "2025-01-25", emailVolume: 108920, threatPercentage: 3.9 },
    { timestamp: "2025-01-26", emailVolume: 94380, threatPercentage: 2.8 }
  ];

  // Mock data for threat distribution
  const threatDistributionData = [
    { name: "Safe", value: 2754123, percentage: 96.8, color: "var(--color-success)" },
    { name: "Low", value: 46789, percentage: 1.6, color: "var(--color-threat-low)" },
    { name: "Medium", value: 32145, percentage: 1.1, color: "var(--color-threat-medium)" },
    { name: "High", value: 10987, percentage: 0.4, color: "var(--color-threat-high)" },
    { name: "Critical", value: 3249, percentage: 0.1, color: "var(--color-threat-critical)" }
  ];

  // Enhanced critical incidents with AI analysis
  const [criticalIncidents, setCriticalIncidents] = useState([
    {
      id: 1,
      severity: "Critical",
      type: "Phishing",
      title: "Advanced Phishing Campaign Detected",
      description: "Sophisticated phishing campaign targeting C-level executives with spoofed domain. Multiple attempts blocked across organization.",
      source: "External",
      affectedCount: "47 users",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      aiAnalysis: null,
      analyzing: false
    },
    {
      id: 2,
      severity: "High",
      type: "Malware",
      title: "Malicious Attachment Campaign",
      description: "ZIP files containing trojans detected in multiple email threads. All instances quarantined successfully.",
      source: "Email Gateway",
      affectedCount: "23 emails",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      aiAnalysis: null,
      analyzing: false
    },
    {
      id: 3,
      severity: "High",
      type: "Suspicious",
      title: "Unusual Email Pattern Detected",
      description: "Abnormal spike in emails from newly registered domains. Potential reconnaissance activity identified.",
      source: "AI Analysis",
      affectedCount: "156 emails",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      aiAnalysis: null,
      analyzing: false
    },
    {
      id: 4,
      severity: "Medium",
      type: "Spam",
      title: "Coordinated Spam Campaign",
      description: "Large-scale spam campaign with cryptocurrency themes. Blocked by content filters.",
      source: "Content Filter",
      affectedCount: "892 emails",
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      aiAnalysis: null,
      analyzing: false
    }
  ]);

  // Mock data for threat heatmap
  const heatmapData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000),
    threatIntensity: {
      Phishing: Math.floor(Math.random() * 100),
      Malware: Math.floor(Math.random() * 80),
      Spam: Math.floor(Math.random() * 60),
      Suspicious: Math.floor(Math.random() * 90),
      Safe: Math.floor(Math.random() * 30)
    }
  }));

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const organizationOptions = [
    { value: 'all', label: 'All Units' },
    { value: 'corporate', label: 'Corporate HQ' },
    { value: 'finance', label: 'Finance Division' },
    { value: 'operations', label: 'Operations' },
    { value: 'sales', label: 'Sales & Marketing' }
  ];

  // Load AI-generated insights on component mount
  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    setIsLoadingInsights(true);
    try {
      // Generate sample threat data for analysis
      const sampleThreatData = [
        { classification: 'phishing', confidence: 94 },
        { classification: 'malware', confidence: 87 },
        { classification: 'safe', confidence: 96 },
        { classification: 'suspicious', confidence: 73 },
        { classification: 'phishing', confidence: 89 }
      ];

      const insights = await generateSecurityInsights(sampleThreatData);
      setAiInsights(insights || []);
    } catch (error) {
      console.error('Failed to load AI insights:', error);
      // Fallback to default insights
      setAiInsights([
        {
          type: 'trend',
          title: 'Performance Trend',
          description: 'Detection accuracy has improved by 2.3% over the last 30 days, with AI models leading performance metrics.',
          icon: 'TrendingUp'
        },
        {
          type: 'attention',
          title: 'Attention Required',
          description: 'Phishing attempts show 15.6% increase during business hours. Consider enhanced monitoring between 9-17 UTC.',
          icon: 'AlertTriangle'
        },
        {
          type: 'optimization',
          title: 'Optimization Opportunity',
          description: 'AI model response times can be improved through load balancing to increase overall throughput.',
          icon: 'Target'
        }
      ]);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh and reload AI insights
    setTimeout(async () => {
      setLastRefresh(new Date());
      await loadAIInsights();
      setIsRefreshing(false);
    }, 2000);
  };

  const handleExport = async (options) => {
    console.log('Exporting report with options:', options);
    // Simulate export process
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  const handleIncidentAnalysis = async (incidentId) => {
    setCriticalIncidents(prev => 
      prev?.map(incident => 
        incident?.id === incidentId 
          ? { ...incident, analyzing: true }
          : incident
      )
    );

    try {
      const incident = criticalIncidents?.find(i => i?.id === incidentId);
      const emailData = {
        sender: 'threat-example@suspicious-domain.com',
        subject: incident?.title,
        content: incident?.description,
        attachments: incident?.type === 'Malware' ? ['suspicious.zip'] : []
      };

      const analysis = await analyzeThreatContent(emailData);
      
      setCriticalIncidents(prev => 
        prev?.map(incident => 
          incident?.id === incidentId 
            ? { ...incident, aiAnalysis: analysis, analyzing: false }
            : incident
        )
      );
    } catch (error) {
      console.error('Failed to analyze incident:', error);
      setCriticalIncidents(prev => 
        prev?.map(incident => 
          incident?.id === incidentId 
            ? { ...incident, analyzing: false }
            : incident
        )
      );
    }
  };

  // Auto-refresh every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 900000); // 15 minutes

    return () => clearInterval(interval);
  }, []);

  const getInsightIcon = (type) => {
    const iconMap = {
      trend: 'TrendingUp',
      attention: 'AlertTriangle', 
      optimization: 'Target'
    };
    return iconMap?.[type] || 'Lightbulb';
  };

  const getInsightColor = (type) => {
    const colorMap = {
      trend: 'text-success',
      attention: 'text-warning',
      optimization: 'text-primary'
    };
    return colorMap?.[type] || 'text-primary';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="security-container py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Executive Threat Intelligence Overview
                </h1>
                <p className="text-text-secondary">
                  AI-powered email threat landscape visibility and security ROI metrics for strategic decision-making
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <Icon name="Clock" size={16} />
                  <span>Last updated: {lastRefresh?.toLocaleTimeString()}</span>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 security-transition disabled:opacity-50"
                >
                  <Icon 
                    name="RefreshCw" 
                    size={16} 
                    className={isRefreshing ? 'animate-spin' : ''} 
                  />
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>
            
            {/* Global Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                label="Time Range"
                options={timeRangeOptions}
                value={timeRange}
                onChange={setTimeRange}
                className="w-full sm:w-48"
              />
              
              <Select
                label="Organization Unit"
                options={organizationOptions}
                value={organizationUnit}
                onChange={setOrganizationUnit}
                className="w-full sm:w-48"
              />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="security-grid security-grid-cols-4 mb-8">
            {kpiData?.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                change={kpi?.change}
                changeType={kpi?.changeType}
                icon={kpi?.icon}
                sparklineData={kpi?.sparklineData}
                unit={kpi?.unit}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Threat Volume Chart - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <ThreatVolumeChart data={threatVolumeData} timeRange={timeRange} />
            </div>
            
            {/* Threat Distribution Chart - Takes 1 column */}
            <div className="xl:col-span-1">
              <ThreatDistributionChart data={threatDistributionData} />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Critical Incidents Feed with AI Analysis - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">Critical Incidents Feed</h3>
                  <Icon name="AlertTriangle" size={20} className="text-warning" />
                </div>
                
                <div className="space-y-4">
                  {criticalIncidents?.map((incident) => (
                    <div key={incident?.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              incident?.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                              incident?.severity === 'High'? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {incident?.severity}
                            </span>
                            <span className="text-sm text-text-secondary">{incident?.type}</span>
                          </div>
                          <h4 className="font-medium text-text-primary mb-1">{incident?.title}</h4>
                          <p className="text-sm text-text-secondary mb-2">{incident?.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-text-secondary">
                            <span>Source: {incident?.source}</span>
                            <span>Affected: {incident?.affectedCount}</span>
                            <span>{incident?.timestamp?.toLocaleTimeString()}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleIncidentAnalysis(incident?.id)}
                          disabled={incident?.analyzing}
                          className="ml-4 px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/80 disabled:opacity-50"
                        >
                          {incident?.analyzing ? 'Analyzing...' : 'AI Analysis'}
                        </button>
                      </div>
                      
                      {incident?.aiAnalysis && (
                        <div className="mt-3 p-3 bg-muted rounded border-l-4 border-primary">
                          <div className="text-sm">
                            <strong>AI Analysis:</strong>
                            <p className="mt-1 text-text-secondary">{incident?.aiAnalysis?.explanation}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs">
                              <span>Confidence: {incident?.aiAnalysis?.confidence}%</span>
                              <span>Risk Level: {incident?.aiAnalysis?.riskLevel}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Export Controls - Takes 1 column */}
            <div className="xl:col-span-1">
              <ExportControls onExport={handleExport} />
            </div>
          </div>

          {/* Threat Heatmap - Full Width */}
          <div className="mb-8">
            <ThreatHeatmap data={heatmapData} timeRange={timeRange} />
          </div>

          {/* AI-Generated Insights Panel */}
          <div className="mt-8 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Icon name="Bot" size={20} className="mr-2" />
              AI-Generated Security Insights
              {isLoadingInsights && (
                <Icon name="Loader2" size={16} className="ml-2 animate-spin" />
              )}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiInsights?.map((insight, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getInsightIcon(insight?.type)} 
                      size={16} 
                      className={getInsightColor(insight?.type)} 
                    />
                    <span className="font-medium text-text-primary">{insight?.title}</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {insight?.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExecutiveThreatIntelligenceOverview;