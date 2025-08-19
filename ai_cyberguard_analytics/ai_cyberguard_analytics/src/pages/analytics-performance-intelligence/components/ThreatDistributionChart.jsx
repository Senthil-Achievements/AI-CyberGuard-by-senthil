import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ThreatDistributionChart = ({ data, onSegmentClick }) => {
  const [viewMode, setViewMode] = useState('count');
  const [selectedSegment, setSelectedSegment] = useState(null);

  // Mock data for threat distribution
  const threatData = data || [
    { name: 'Phishing', value: 847, percentage: 45.2, color: '#ef4444' },
    { name: 'Malware', value: 523, percentage: 27.9, color: '#f59e0b' },
    { name: 'Spam', value: 312, percentage: 16.7, color: '#3b82f6' },
    { name: 'Suspicious', value: 156, percentage: 8.3, color: '#8b5cf6' },
    { name: 'Safe (False Positive)', value: 35, percentage: 1.9, color: '#10b981' }
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for segments < 5%

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="600"
      >
        {`${(percent * 100)?.toFixed(1)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="font-medium text-text-primary mb-2">{data?.name}</p>
          <p className="text-sm text-text-secondary">
            Count: <span className="font-medium text-text-primary">{data?.value?.toLocaleString()}</span>
          </p>
          <p className="text-sm text-text-secondary">
            Percentage: <span className="font-medium text-text-primary">{data?.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const handleSegmentClick = (data, index) => {
    setSelectedSegment(selectedSegment === index ? null : index);
    onSegmentClick && onSegmentClick(data);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'count' ? 'percentage' : 'count');
  };

  const exportData = () => {
    console.log('Exporting threat distribution data...');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="PieChart" size={20} className="mr-2" />
          Threat Type Distribution
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleViewMode}
            iconName="BarChart3"
            iconPosition="left"
          >
            {viewMode === 'count' ? 'Show %' : 'Show Count'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
      {/* Pie Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={threatData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              onClick={handleSegmentClick}
            >
              {threatData?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry?.color}
                  stroke={selectedSegment === index ? '#ffffff' : 'none'}
                  strokeWidth={selectedSegment === index ? 3 : 0}
                  style={{ 
                    filter: selectedSegment !== null && selectedSegment !== index ? 'opacity(0.6)' : 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend with Details */}
      <div className="space-y-3">
        {threatData?.map((item, index) => (
          <div
            key={item?.name}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer security-transition ${
              selectedSegment === index 
                ? 'bg-muted border border-primary' :'hover:bg-muted/50'
            }`}
            onClick={() => handleSegmentClick(item, index)}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item?.color }}
              />
              <span className="font-medium text-text-primary">{item?.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary">
                {viewMode === 'count' ? item?.value?.toLocaleString() : `${item?.percentage}%`}
              </span>
              <Icon 
                name="ChevronRight" 
                size={16} 
                className={`text-text-secondary security-transition ${
                  selectedSegment === index ? 'rotate-90' : ''
                }`}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Selected Segment Details */}
      {selectedSegment !== null && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-3">
              {threatData?.[selectedSegment]?.name} Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Total Count:</span>
                <span className="ml-2 font-medium text-text-primary">
                  {threatData?.[selectedSegment]?.value?.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Percentage:</span>
                <span className="ml-2 font-medium text-text-primary">
                  {threatData?.[selectedSegment]?.percentage}%
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Trend:</span>
                <span className="ml-2 font-medium text-success">
                  +12.3% vs last period
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Avg Confidence:</span>
                <span className="ml-2 font-medium text-text-primary">
                  {(85 + Math.random() * 10)?.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-text-primary">
              {threatData?.reduce((sum, item) => sum + item?.value, 0)?.toLocaleString()}
            </div>
            <div className="text-xs text-text-secondary">Total Threats</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-error">
              {threatData?.[0]?.name}
            </div>
            <div className="text-xs text-text-secondary">Most Common</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-text-primary">
              {threatData?.length}
            </div>
            <div className="text-xs text-text-secondary">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatDistributionChart;