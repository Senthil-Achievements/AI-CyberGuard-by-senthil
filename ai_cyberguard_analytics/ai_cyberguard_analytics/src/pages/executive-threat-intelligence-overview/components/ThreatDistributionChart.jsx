import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ThreatDistributionChart = ({ data }) => {
  const COLORS = {
    'Critical': 'var(--color-threat-critical)',
    'High': 'var(--color-threat-high)', 
    'Medium': 'var(--color-threat-medium)',
    'Low': 'var(--color-threat-low)',
    'Safe': 'var(--color-success)'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data?.payload?.color }}
            />
            <span className="text-sm font-medium text-text-primary">
              {data?.payload?.name}
            </span>
          </div>
          <div className="mt-1 text-sm text-text-secondary">
            Count: <span className="font-medium text-text-primary">{data?.value?.toLocaleString()}</span>
          </div>
          <div className="text-sm text-text-secondary">
            Percentage: <span className="font-medium text-text-primary">{data?.payload?.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    if (percentage < 5) return null; // Don't show labels for small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

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
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div className="security-card h-full">
      <div className="security-card-header">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Threat Severity Distribution</h3>
          <p className="text-sm text-text-secondary mt-1">
            Current threat landscape breakdown
          </p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS?.[entry?.name]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data?.map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS?.[entry?.name] }}
              />
              <span className="text-text-secondary">{entry?.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-medium text-text-primary">
                {entry?.value?.toLocaleString()}
              </span>
              <span className="text-xs text-text-secondary w-10 text-right">
                {entry?.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatDistributionChart;