import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const BatchResultsVisualization = ({ batchData, processingMetrics }) => {
  const [activeChart, setActiveChart] = useState('threat-distribution');
  const [timeRange, setTimeRange] = useState('24h');

  const chartOptions = [
    { value: 'threat-distribution', label: 'Threat Distribution' },
    { value: 'processing-efficiency', label: 'Processing Efficiency' },
    { value: 'batch-timeline', label: 'Batch Timeline' },
    { value: 'file-analysis', label: 'File Analysis' }
  ];

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  // Mock data for threat distribution across files
  const threatDistributionData = [
    { filename: 'emails_batch_001.txt', safe: 245, suspicious: 12, phishing: 3, total: 260 },
    { filename: 'emails_batch_002.txt', safe: 189, suspicious: 8, phishing: 7, total: 204 },
    { filename: 'emails_batch_003.txt', safe: 312, suspicious: 15, phishing: 2, total: 329 },
    { filename: 'emails_batch_004.txt', safe: 156, suspicious: 22, phishing: 9, total: 187 },
    { filename: 'emails_batch_005.txt', safe: 278, suspicious: 6, phishing: 1, total: 285 }
  ];

  // Mock data for processing efficiency over time
  const processingEfficiencyData = [
    { time: '00:00', emailsPerMinute: 45, cpuUsage: 65, memoryUsage: 72 },
    { time: '04:00', emailsPerMinute: 52, cpuUsage: 58, memoryUsage: 68 },
    { time: '08:00', emailsPerMinute: 38, cpuUsage: 78, memoryUsage: 85 },
    { time: '12:00', emailsPerMinute: 41, cpuUsage: 82, memoryUsage: 89 },
    { time: '16:00', emailsPerMinute: 47, cpuUsage: 71, memoryUsage: 76 },
    { time: '20:00', emailsPerMinute: 49, cpuUsage: 63, memoryUsage: 71 }
  ];

  // Mock data for batch processing timeline
  const batchTimelineData = [
    { date: '2025-01-15', batches: 12, totalEmails: 3240, avgProcessingTime: 145 },
    { date: '2025-01-16', batches: 15, totalEmails: 4180, avgProcessingTime: 132 },
    { date: '2025-01-17', batches: 8, totalEmails: 2890, avgProcessingTime: 158 },
    { date: '2025-01-18', batches: 18, totalEmails: 5120, avgProcessingTime: 128 },
    { date: '2025-01-19', batches: 14, totalEmails: 3950, avgProcessingTime: 141 }
  ];

  // Pie chart data for overall threat distribution
  const overallThreatData = [
    { name: 'Safe', value: 1180, color: '#10b981' },
    { name: 'Suspicious', value: 63, color: '#f59e0b' },
    { name: 'Phishing', value: 22, color: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderThreatDistributionChart = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stacked Bar Chart */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h4 className="font-medium text-text-primary mb-4">Threat Distribution by File</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="filename" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="safe" stackId="a" fill="#10b981" name="Safe" />
                <Bar dataKey="suspicious" stackId="a" fill="#f59e0b" name="Suspicious" />
                <Bar dataKey="phishing" stackId="a" fill="#ef4444" name="Phishing" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h4 className="font-medium text-text-primary mb-4">Overall Threat Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallThreatData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {overallThreatData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {overallThreatData?.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-sm text-text-secondary">
                  {entry?.name}: {entry?.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcessingEfficiencyChart = () => (
    <div className="bg-background border border-border rounded-lg p-4">
      <h4 className="font-medium text-text-primary mb-4">Processing Efficiency Over Time</h4>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processingEfficiencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="emailsPerMinute" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Emails/Min"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="cpuUsage" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="CPU Usage %"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="memoryUsage" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Memory Usage %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderBatchTimelineChart = () => (
    <div className="bg-background border border-border rounded-lg p-4">
      <h4 className="font-medium text-text-primary mb-4">Batch Processing Timeline</h4>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={batchTimelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="totalEmails" 
              stroke="#17a2b8" 
              fill="#17a2b8" 
              fillOpacity={0.3}
              name="Total Emails"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderFileAnalysisChart = () => (
    <div className="bg-background border border-border rounded-lg p-4">
      <h4 className="font-medium text-text-primary mb-4">File Analysis Performance</h4>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={threatDistributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="filename" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="#3b82f6" name="Total Emails" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderActiveChart = () => {
    switch (activeChart) {
      case 'threat-distribution':
        return renderThreatDistributionChart();
      case 'processing-efficiency':
        return renderProcessingEfficiencyChart();
      case 'batch-timeline':
        return renderBatchTimelineChart();
      case 'file-analysis':
        return renderFileAnalysisChart();
      default:
        return renderThreatDistributionChart();
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">Batch Results Visualization</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            options={chartOptions}
            value={activeChart}
            onChange={setActiveChart}
            className="sm:w-48"
          />
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            className="sm:w-36"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Icon name="FileCheck" size={20} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Files Processed</p>
              <p className="text-xl font-semibold text-text-primary">1,265</p>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Icon name="Mail" size={20} color="var(--color-secondary)" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Emails Analyzed</p>
              <p className="text-xl font-semibold text-text-primary">19,390</p>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-error/10 rounded-lg">
              <Icon name="Shield" size={20} color="var(--color-error)" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Threats Detected</p>
              <p className="text-xl font-semibold text-text-primary">85</p>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Icon name="Clock" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Avg Processing Time</p>
              <p className="text-xl font-semibold text-text-primary">2.4m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Chart */}
      {renderActiveChart()}

      {/* Processing Insights */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h4 className="font-medium text-text-primary mb-4 flex items-center space-x-2">
          <Icon name="Lightbulb" size={18} />
          <span>Processing Insights</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h5 className="font-medium text-text-primary">Performance Highlights</h5>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={14} color="var(--color-success)" />
                <span>Processing speed improved by 15% this week</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Shield" size={14} color="var(--color-secondary)" />
                <span>99.2% accuracy in threat detection</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Clock" size={14} color="var(--color-warning)" />
                <span>Average processing time: 2.4 minutes per file</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-medium text-text-primary">Recommendations</h5>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={14} color="var(--color-warning)" />
                <span>Consider increasing batch size during off-peak hours</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Settings" size={14} color="var(--color-secondary)" />
                <span>Optimize memory usage for larger file processing</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Database" size={14} color="var(--color-primary)" />
                <span>Archive processed files older than 90 days</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchResultsVisualization;