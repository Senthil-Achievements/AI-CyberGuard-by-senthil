import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsGrid = ({ metrics, onMetricClick }) => {
  const metricCards = [
    {
      id: 'detection_accuracy',
      title: 'Detection Accuracy',
      value: metrics?.detectionAccuracy || '94.7%',
      change: '+2.3%',
      trend: 'up',
      icon: 'Target',
      color: 'success',
      description: 'Overall threat detection accuracy rate'
    },
    {
      id: 'false_positive_rate',
      title: 'False Positive Rate',
      value: metrics?.falsePositiveRate || '3.2%',
      change: '-0.8%',
      trend: 'down',
      icon: 'AlertTriangle',
      color: 'warning',
      description: 'Percentage of incorrectly flagged safe emails'
    },
    {
      id: 'processing_throughput',
      title: 'Processing Throughput',
      value: metrics?.processingThroughput || '12.4K',
      change: '+15.6%',
      trend: 'up',
      icon: 'Zap',
      color: 'primary',
      description: 'Emails processed per hour',
      suffix: '/hr'
    },
    {
      id: 'model_confidence',
      title: 'Avg Model Confidence',
      value: metrics?.modelConfidence || '87.3%',
      change: '+1.2%',
      trend: 'up',
      icon: 'Brain',
      color: 'secondary',
      description: 'Average confidence score across all detections'
    },
    {
      id: 'threat_evolution',
      title: 'Threat Evolution Score',
      value: metrics?.threatEvolution || '6.8/10',
      change: '+0.4',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'error',
      description: 'Rate of new threat pattern emergence'
    },
    {
      id: 'awareness_effectiveness',
      title: 'Security Awareness',
      value: metrics?.awarenessEffectiveness || '78.5%',
      change: '+5.2%',
      trend: 'up',
      icon: 'Shield',
      color: 'success',
      description: 'User security awareness training effectiveness'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      success: 'text-success bg-success/10 border-success/20',
      warning: 'text-warning bg-warning/10 border-warning/20',
      error: 'text-error bg-error/10 border-error/20',
      primary: 'text-primary bg-primary/10 border-primary/20',
      secondary: 'text-secondary bg-secondary/10 border-secondary/20'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-text-secondary';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {metricCards?.map((metric) => (
        <div
          key={metric?.id}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-lg security-transition cursor-pointer"
          onClick={() => onMetricClick(metric?.id)}
          title={metric?.description}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${getColorClasses(metric?.color)}`}>
              <Icon name={metric?.icon} size={20} />
            </div>
            <div className={`flex items-center text-sm font-medium ${getTrendColor(metric?.trend)}`}>
              <Icon name={getTrendIcon(metric?.trend)} size={14} className="mr-1" />
              {metric?.change}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-text-secondary leading-tight">
              {metric?.title}
            </h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-text-primary">
                {metric?.value}
              </span>
              {metric?.suffix && (
                <span className="text-sm text-text-secondary ml-1">
                  {metric?.suffix}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-text-secondary">
              {metric?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;