import React, { useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ThreatTrendsChart = ({ data, onDataPointClick }) => {
  const [aggregationLevel, setAggregationLevel] = useState('daily');
  const [showBrush, setShowBrush] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState(['threats', 'confidence']);

  const aggregationOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ];

  const metricOptions = [
    { value: 'threats', label: 'Threat Count', color: '#ef4444' },
    { value: 'confidence', label: 'Avg Confidence', color: '#3b82f6' },
    { value: 'falsePositives', label: 'False Positives', color: '#f59e0b' },
    { value: 'processingTime', label: 'Processing Time', color: '#10b981' }
  ];

  // Mock data for the chart
  const chartData = data || [
    {
      date: '2025-08-12',
      threats: 145,
      confidence: 87.3,
      falsePositives: 8,
      processingTime: 2.4,
      phishing: 89,
      malware: 34,
      spam: 22
    },
    {
      date: '2025-08-13',
      threats: 167,
      confidence: 89.1,
      falsePositives: 6,
      processingTime: 2.1,
      phishing: 102,
      malware: 41,
      spam: 24
    },
    {
      date: '2025-08-14',
      threats: 134,
      confidence: 91.2,
      falsePositives: 4,
      processingTime: 1.9,
      phishing: 78,
      malware: 32,
      spam: 24
    },
    {
      date: '2025-08-15',
      threats: 189,
      confidence: 88.7,
      falsePositives: 9,
      processingTime: 2.6,
      phishing: 115,
      malware: 45,
      spam: 29
    },
    {
      date: '2025-08-16',
      threats: 156,
      confidence: 90.4,
      falsePositives: 5,
      processingTime: 2.0,
      phishing: 94,
      malware: 38,
      spam: 24
    },
    {
      date: '2025-08-17',
      threats: 178,
      confidence: 92.1,
      falsePositives: 3,
      processingTime: 1.8,
      phishing: 108,
      malware: 42,
      spam: 28
    },
    {
      date: '2025-08-18',
      threats: 203,
      confidence: 89.8,
      falsePositives: 7,
      processingTime: 2.3,
      phishing: 124,
      malware: 48,
      spam: 31
    },
    {
      date: '2025-08-19',
      threats: 167,
      confidence: 91.5,
      falsePositives: 4,
      processingTime: 1.9,
      phishing: 98,
      malware: 41,
      spam: 28
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="font-medium text-text-primary mb-2">{`Date: ${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value}${entry?.name?.includes('Confidence') ? '%' : entry?.name?.includes('Time') ? 's' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleMetricToggle = (metric) => {
    setSelectedMetrics(prev => 
      prev?.includes(metric) 
        ? prev?.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const exportChart = () => {
    // Mock export functionality
    console.log('Exporting chart data...');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            <Icon name="TrendingUp" size={20} className="mr-2" />
            Threat Detection Trends
          </h3>
          <Select
            options={aggregationOptions}
            value={aggregationLevel}
            onChange={setAggregationLevel}
            className="w-32"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBrush(!showBrush)}
            iconName={showBrush ? "ZoomOut" : "ZoomIn"}
            iconPosition="left"
          >
            {showBrush ? 'Hide' : 'Show'} Zoom
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportChart}
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
      {/* Metric Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metricOptions?.map((metric) => (
          <button
            key={metric?.value}
            onClick={() => handleMetricToggle(metric?.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium security-transition ${
              selectedMetrics?.includes(metric?.value)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-text-secondary hover:bg-muted/80'
            }`}
          >
            <span 
              className="inline-block w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: metric?.color }}
            />
            {metric?.label}
          </button>
        ))}
      </div>
      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onClick={onDataPointClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {selectedMetrics?.includes('threats') && (
              <Bar 
                yAxisId="left"
                dataKey="threats" 
                fill="#ef4444" 
                name="Threat Count"
                opacity={0.8}
              />
            )}
            
            {selectedMetrics?.includes('confidence') && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="confidence" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Avg Confidence (%)"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            )}
            
            {selectedMetrics?.includes('falsePositives') && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="falsePositives" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="False Positives"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              />
            )}
            
            {selectedMetrics?.includes('processingTime') && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="processingTime" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Processing Time (s)"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            )}
            
            {showBrush && (
              <Brush 
                dataKey="date" 
                height={30} 
                stroke="var(--color-primary)"
                fill="var(--color-muted)"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-text-primary">1,339</div>
            <div className="text-xs text-text-secondary">Total Threats</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-text-primary">89.9%</div>
            <div className="text-xs text-text-secondary">Avg Confidence</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-text-primary">46</div>
            <div className="text-xs text-text-secondary">False Positives</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-text-primary">2.1s</div>
            <div className="text-xs text-text-secondary">Avg Processing</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatTrendsChart;