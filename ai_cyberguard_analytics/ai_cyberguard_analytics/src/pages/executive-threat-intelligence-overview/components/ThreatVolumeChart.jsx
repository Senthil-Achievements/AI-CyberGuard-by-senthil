import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ThreatVolumeChart = ({ data, timeRange }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-4">
          <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-text-secondary">{entry?.dataKey}:</span>
              <span className="font-medium text-text-primary">
                {entry?.dataKey === 'threatPercentage' 
                  ? `${entry?.value}%` 
                  : entry?.value?.toLocaleString()
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatXAxisLabel = (tickItem) => {
    if (timeRange === '24h') {
      return new Date(tickItem)?.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (timeRange === '7d') {
      return new Date(tickItem)?.toLocaleDateString('en-US', { 
        weekday: 'short' 
      });
    } else {
      return new Date(tickItem)?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="security-card h-full">
      <div className="security-card-header">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Email Volume vs Threat Detection</h3>
          <p className="text-sm text-text-secondary mt-1">
            Correlation analysis between email volume and threat percentage
          </p>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxisLabel}
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickFormatter={(value) => value?.toLocaleString()}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="emailVolume" 
              fill="var(--color-primary)"
              name="Email Volume"
              opacity={0.7}
              radius={[2, 2, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="threatPercentage" 
              stroke="var(--color-error)"
              strokeWidth={3}
              name="Threat %"
              dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-error)', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThreatVolumeChart;