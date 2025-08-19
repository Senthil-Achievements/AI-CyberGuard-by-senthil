import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, sparklineData, unit = '' }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-text-secondary';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  const generateSparklinePath = (data) => {
    if (!data || data?.length === 0) return '';
    
    const width = 60;
    const height = 20;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return data?.map((value, index) => {
      const x = (index / (data?.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })?.join(' ');
  };

  return (
    <div className="security-card h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name={icon} size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
          </div>
        </div>
        {sparklineData && (
          <div className="w-16 h-6">
            <svg width="60" height="20" className="overflow-visible">
              <path
                d={generateSparklinePath(sparklineData)}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="1.5"
                className="opacity-60"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="data-metric text-3xl">
            {typeof value === 'number' ? value?.toLocaleString() : value}
          </span>
          {unit && <span className="text-sm text-text-secondary font-medium">{unit}</span>}
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={14} />
            <span className="text-sm font-medium">
              {Math.abs(change)}% vs last month
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;