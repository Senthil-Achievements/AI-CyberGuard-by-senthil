import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemMonitoring = ({ systemMetrics }) => {
  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-error';
    if (percentage >= 75) return 'text-warning';
    if (percentage >= 50) return 'text-secondary';
    return 'text-success';
  };

  const getUsageBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 75) return 'bg-warning';
    if (percentage >= 50) return 'bg-secondary';
    return 'bg-success';
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(1)) + ' ' + sizes?.[i];
  };

  const MetricCard = ({ icon, title, value, unit, percentage, threshold, description }) => (
    <div className="bg-background border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name={icon} size={18} color="var(--color-primary)" />
          <h4 className="font-medium text-text-primary">{title}</h4>
        </div>
        {percentage >= threshold && (
          <Icon name="AlertTriangle" size={16} className="text-warning" />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl font-semibold ${getUsageColor(percentage)}`}>
            {value}
          </span>
          <span className="text-sm text-text-secondary">{unit}</span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Usage</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getUsageBarColor(percentage)}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-text-secondary">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="security-card">
      <div className="security-card-header">
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">System Monitoring</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-text-secondary">Live</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <MetricCard
          icon="Cpu"
          title="CPU Usage"
          value={systemMetrics?.cpu?.usage}
          unit="%"
          percentage={systemMetrics?.cpu?.usage}
          threshold={80}
          description={`${systemMetrics?.cpu?.cores} cores • ${systemMetrics?.cpu?.frequency} GHz`}
        />

        <MetricCard
          icon="HardDrive"
          title="Memory Usage"
          value={formatBytes(systemMetrics?.memory?.used)}
          unit=""
          percentage={systemMetrics?.memory?.percentage}
          threshold={85}
          description={`${formatBytes(systemMetrics?.memory?.total)} total available`}
        />

        <MetricCard
          icon="Database"
          title="Disk Usage"
          value={formatBytes(systemMetrics?.disk?.used)}
          unit=""
          percentage={systemMetrics?.disk?.percentage}
          threshold={90}
          description={`${formatBytes(systemMetrics?.disk?.total)} total capacity`}
        />

        <MetricCard
          icon="Wifi"
          title="Network I/O"
          value={systemMetrics?.network?.throughput}
          unit="Mbps"
          percentage={systemMetrics?.network?.utilization}
          threshold={75}
          description={`${systemMetrics?.network?.packetsPerSecond} packets/sec`}
        />
      </div>
      <div className="space-y-4">
        <h4 className="font-medium text-text-primary flex items-center space-x-2">
          <Icon name="Zap" size={16} />
          <span>API Rate Limiting</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {systemMetrics?.apiLimits?.map((api, index) => (
            <div key={index} className="bg-muted rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">{api?.service}</span>
                <span className={`text-xs ${api?.usage >= 90 ? 'text-error' : api?.usage >= 75 ? 'text-warning' : 'text-success'}`}>
                  {api?.used}/{api?.limit}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="w-full bg-background rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      api?.usage >= 90 ? 'bg-error' : api?.usage >= 75 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${api?.usage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>Reset: {api?.resetTime}</span>
                  <span>{api?.usage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-text-secondary">Optimal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-text-secondary">Warning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-error rounded-full"></div>
              <span className="text-text-secondary">Critical</span>
            </div>
          </div>
          <span className="text-text-secondary">
            Last updated: {new Date()?.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoring;