import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertStrip = ({ threatData }) => {
  const alertCards = [
    {
      title: 'Active Phishing',
      value: threatData?.activePhishing,
      change: '+12',
      changeType: 'increase',
      icon: 'AlertTriangle',
      color: 'error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20'
    },
    {
      title: 'Suspicious Under Review',
      value: threatData?.suspiciousReview,
      change: '+5',
      changeType: 'increase',
      icon: 'Eye',
      color: 'warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      title: 'False Positive Rate',
      value: `${threatData?.falsePositiveRate}%`,
      change: '-0.3%',
      changeType: 'decrease',
      icon: 'TrendingDown',
      color: 'success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      title: 'AI Response Time',
      value: `${threatData?.aiResponseTime}ms`,
      change: '+15ms',
      changeType: 'increase',
      icon: 'Zap',
      color: 'secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    }
  ];

  const getStatusColor = (color) => {
    const colorMap = {
      error: 'text-error',
      warning: 'text-warning',
      success: 'text-success',
      secondary: 'text-secondary'
    };
    return colorMap?.[color] || 'text-text-secondary';
  };

  const getChangeColor = (changeType) => {
    return changeType === 'increase' ? 'text-error' : 'text-success';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {alertCards?.map((card, index) => (
        <div
          key={index}
          className={`${card?.bgColor} ${card?.borderColor} border rounded-lg p-4 security-transition hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-2">
            <Icon 
              name={card?.icon} 
              size={20} 
              className={getStatusColor(card?.color)}
            />
            <span className={`text-xs font-medium ${getChangeColor(card?.changeType)}`}>
              {card?.change}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold text-text-primary font-mono">
              {card?.value}
            </div>
            <div className="text-sm text-text-secondary font-medium">
              {card?.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertStrip;