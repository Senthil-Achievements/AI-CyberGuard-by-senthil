import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';

const AIModelPerformance = ({ performanceData }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} style={{ color: entry?.color }}>
              {`${entry?.dataKey}: ${entry?.value}${entry?.dataKey?.includes('Time') ? 'ms' : entry?.dataKey?.includes('Rate') ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const modelMetrics = [
    {
      title: 'Accuracy Rate',
      value: '94.7%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'Target',
      color: 'success'
    },
    {
      title: 'False Positive Rate',
      value: '3.2%',
      change: '-0.8%',
      changeType: 'positive',
      icon: 'AlertCircle',
      color: 'warning'
    },
    {
      title: 'Processing Speed',
      value: '127ms',
      change: '+15ms',
      changeType: 'negative',
      icon: 'Zap',
      color: 'secondary'
    },
    {
      title: 'Model Uptime',
      value: '99.9%',
      change: '0%',
      changeType: 'neutral',
      icon: 'Activity',
      color: 'success'
    }
  ];

  const getMetricColor = (color) => {
    const colorMap = {
      success: 'text-success',
      warning: 'text-warning',
      secondary: 'text-secondary',
      error: 'text-error'
    };
    return colorMap?.[color] || 'text-text-secondary';
  };

  const getChangeColor = (changeType) => {
    const colorMap = {
      positive: 'text-success',
      negative: 'text-error',
      neutral: 'text-text-secondary'
    };
    return colorMap?.[changeType] || 'text-text-secondary';
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modelMetrics?.map((metric, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Icon 
                name={metric?.icon} 
                size={20} 
                className={getMetricColor(metric?.color)}
              />
              <span className={`text-xs font-medium ${getChangeColor(metric?.changeType)}`}>
                {metric?.change}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="text-2xl font-bold text-text-primary font-mono">
                {metric?.value}
              </div>
              <div className="text-sm text-text-secondary font-medium">
                {metric?.title}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trend */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-text-primary flex items-center">
              <Icon name="TrendingUp" size={18} className="mr-2" />
              Response Time Trend
            </h4>
            <div className="text-sm text-text-secondary">
              Last 24 hours
            </div>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData?.responseTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="var(--color-secondary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Trend */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-text-primary flex items-center">
              <Icon name="Target" size={18} className="mr-2" />
              Accuracy Rate Trend
            </h4>
            <div className="text-sm text-text-secondary">
              Last 24 hours
            </div>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData?.accuracy}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <YAxis 
                  domain={[85, 100]}
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="accuracyRate" 
                  stroke="var(--color-success)" 
                  fill="var(--color-success)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Model Status Details */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="text-lg font-semibold text-text-primary flex items-center mb-4">
          <Icon name="Settings" size={18} className="mr-2" />
          Model Configuration & Status
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h5 className="font-medium text-text-primary">Current Model</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Model Version:</span>
                <span className="font-mono text-text-primary">v2.4.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Training Date:</span>
                <span className="font-mono text-text-primary">2025-01-15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Dataset Size:</span>
                <span className="font-mono text-text-primary">2.3M emails</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-medium text-text-primary">Performance Metrics</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Precision:</span>
                <span className="font-mono text-success">96.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Recall:</span>
                <span className="font-mono text-success">93.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">F1 Score:</span>
                <span className="font-mono text-success">95.0%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-medium text-text-primary">System Status</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">API Status:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-success">Online</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Queue Length:</span>
                <span className="font-mono text-text-primary">3 emails</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Last Update:</span>
                <span className="font-mono text-text-primary">2 min ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelPerformance;