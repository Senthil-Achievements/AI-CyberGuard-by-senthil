import React from 'react';
import Icon from '../../../components/AppIcon';

const CriticalIncidentsFeed = ({ incidents }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-threat-critical';
      case 'high': return 'text-threat-high';
      case 'medium': return 'text-threat-medium';
      case 'low': return 'text-threat-low';
      default: return 'text-text-secondary';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-error/10 border-error/20';
      case 'high': return 'bg-warning/10 border-warning/20';
      case 'medium': return 'bg-secondary/10 border-secondary/20';
      case 'low': return 'bg-success/10 border-success/20';
      default: return 'bg-muted border-border';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const incident = new Date(timestamp);
    const diffInMinutes = Math.floor((now - incident) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getThreatIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'phishing': return 'Fish';
      case 'malware': return 'Bug';
      case 'spam': return 'Mail';
      case 'suspicious': return 'AlertTriangle';
      default: return 'Shield';
    }
  };

  return (
    <div className="security-card h-full">
      <div className="security-card-header">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Critical Incidents</h3>
          <p className="text-sm text-text-secondary mt-1">
            Recent high-priority security events
          </p>
        </div>
        <button className="text-primary hover:text-primary/80 text-sm font-medium security-transition">
          View All
        </button>
      </div>
      <div className="space-y-3 security-scrollbar overflow-y-auto max-h-80">
        {incidents?.map((incident, index) => (
          <div 
            key={index}
            className={`border rounded-lg p-4 security-transition hover:shadow-sm ${getSeverityBg(incident?.severity)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getSeverityBg(incident?.severity)}`}>
                  <Icon 
                    name={getThreatIcon(incident?.type)} 
                    size={16} 
                    className={getSeverityColor(incident?.severity)}
                  />
                </div>
                <div>
                  <span className={`status-indicator ${
                    incident?.severity?.toLowerCase() === 'critical' ? 'status-critical' :
                    incident?.severity?.toLowerCase() === 'high' ? 'status-warning' :
                    incident?.severity?.toLowerCase() === 'medium'? 'status-info' : 'status-success'
                  }`}>
                    {incident?.severity}
                  </span>
                </div>
              </div>
              <span className="text-xs text-text-secondary">
                {getTimeAgo(incident?.timestamp)}
              </span>
            </div>
            
            <h4 className="font-medium text-text-primary text-sm mb-1">
              {incident?.title}
            </h4>
            
            <p className="text-xs text-text-secondary mb-2 line-clamp-2">
              {incident?.description}
            </p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <span className="text-text-secondary">
                  Source: <span className="font-medium text-text-primary">{incident?.source}</span>
                </span>
                <span className="text-text-secondary">
                  Affected: <span className="font-medium text-text-primary">{incident?.affectedCount}</span>
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} className="text-text-secondary" />
                <span className="text-text-secondary">
                  {new Date(incident.timestamp)?.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">
            {incidents?.length} incidents in last 24h
          </span>
          <button className="text-primary hover:text-primary/80 font-medium security-transition">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriticalIncidentsFeed;