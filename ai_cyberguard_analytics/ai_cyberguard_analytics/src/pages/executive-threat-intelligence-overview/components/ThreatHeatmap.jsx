import React from 'react';

const ThreatHeatmap = ({ data, timeRange }) => {
  const threatTypes = ['Phishing', 'Malware', 'Spam', 'Suspicious', 'Safe'];
  
  const getIntensityColor = (intensity) => {
    if (intensity >= 80) return 'bg-threat-critical';
    if (intensity >= 60) return 'bg-threat-high';
    if (intensity >= 40) return 'bg-threat-medium';
    if (intensity >= 20) return 'bg-threat-low';
    return 'bg-success/20';
  };

  const getIntensityOpacity = (intensity) => {
    return Math.max(0.1, intensity / 100);
  };

  const formatTimeLabel = (timestamp) => {
    const date = new Date(timestamp);
    if (timeRange === '24h') {
      return date?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '7d') {
      return date?.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="security-card">
      <div className="security-card-header">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Threat Pattern Heatmap</h3>
          <p className="text-sm text-text-secondary mt-1">
            Threat intensity patterns across time and categories
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-text-secondary">Intensity:</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success/20 rounded"></div>
              <span className="text-text-secondary">Low</span>
              <div className="w-3 h-3 bg-threat-medium rounded"></div>
              <span className="text-text-secondary">Medium</span>
              <div className="w-3 h-3 bg-threat-critical rounded"></div>
              <span className="text-text-secondary">High</span>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header with time labels */}
          <div className="flex mb-2">
            <div className="w-24 flex-shrink-0"></div>
            <div className="flex-1 grid grid-cols-12 gap-1">
              {data?.slice(0, 12)?.map((item, index) => (
                <div key={index} className="text-xs text-text-secondary text-center py-1">
                  {formatTimeLabel(item?.timestamp)}
                </div>
              ))}
            </div>
          </div>
          
          {/* Heatmap grid */}
          <div className="space-y-1">
            {threatTypes?.map((threatType, typeIndex) => (
              <div key={threatType} className="flex items-center">
                <div className="w-24 flex-shrink-0 text-sm font-medium text-text-secondary pr-3 text-right">
                  {threatType}
                </div>
                <div className="flex-1 grid grid-cols-12 gap-1">
                  {data?.slice(0, 12)?.map((timeData, timeIndex) => {
                    const intensity = timeData?.threatIntensity?.[threatType] || 0;
                    return (
                      <div
                        key={`${typeIndex}-${timeIndex}`}
                        className={`h-8 rounded cursor-pointer security-transition hover:scale-105 ${getIntensityColor(intensity)}`}
                        style={{ opacity: getIntensityOpacity(intensity) }}
                        title={`${threatType} at ${formatTimeLabel(timeData?.timestamp)}: ${intensity}% intensity`}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          {intensity > 50 && (
                            <span className="text-xs font-bold text-white">
                              {Math.round(intensity)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Summary stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">
              {data?.reduce((sum, item) => sum + (item?.threatIntensity?.Phishing || 0), 0) / data?.length}%
            </div>
            <div className="text-xs text-text-secondary">Avg Phishing</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">
              {data?.reduce((sum, item) => sum + (item?.threatIntensity?.Malware || 0), 0) / data?.length}%
            </div>
            <div className="text-xs text-text-secondary">Avg Malware</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">
              {Math.max(...data?.map(item => Math.max(...Object.values(item?.threatIntensity))))}%
            </div>
            <div className="text-xs text-text-secondary">Peak Intensity</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">
              {data?.filter(item => Math.max(...Object.values(item?.threatIntensity)) > 70)?.length}
            </div>
            <div className="text-xs text-text-secondary">High Risk Periods</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatHeatmap;