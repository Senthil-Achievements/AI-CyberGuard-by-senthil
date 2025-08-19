import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const ThreatDistribution = ({ distributionData }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-text-primary">{`Confidence: ${label}%`}</p>
          <p className="text-primary">
            {`Threats: ${payload?.[0]?.value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const totalThreats = distributionData?.reduce((sum, item) => sum + item?.count, 0);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Confidence Distribution
        </h3>
        <div className="text-sm text-text-secondary">
          Total: <span className="font-mono font-semibold text-text-primary">{totalThreats}</span>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={distributionData}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="range" 
              tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="var(--color-primary)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">High Confidence (90-100%):</span>
          <span className="font-mono font-semibold text-success">
            {distributionData?.find(d => d?.range === '90-100')?.count || 0}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Medium Confidence (70-89%):</span>
          <span className="font-mono font-semibold text-warning">
            {distributionData?.find(d => d?.range === '70-89')?.count || 0}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Low Confidence (50-69%):</span>
          <span className="font-mono font-semibold text-error">
            {distributionData?.find(d => d?.range === '50-69')?.count || 0}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Very Low (&lt;50%):</span>
          <span className="font-mono font-semibold text-text-secondary">
            {distributionData?.find(d => d?.range === '<50')?.count || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ThreatDistribution;