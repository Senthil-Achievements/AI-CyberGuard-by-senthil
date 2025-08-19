import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ThreatTimeline = ({ threats, onThreatAction }) => {
  const [selectedThreat, setSelectedThreat] = useState(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new threats arrive
    if (timelineRef?.current) {
      timelineRef.current.scrollTop = timelineRef?.current?.scrollHeight;
    }
  }, [threats]);

  const getThreatColor = (classification) => {
    const colorMap = {
      'phishing': 'text-error bg-error/10 border-error/20',
      'suspicious': 'text-warning bg-warning/10 border-warning/20',
      'safe': 'text-success bg-success/10 border-success/20',
      'malware': 'text-error bg-error/10 border-error/20'
    };
    return colorMap?.[classification] || 'text-text-secondary bg-muted border-border';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-error';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const handleThreatClick = (threat) => {
    setSelectedThreat(selectedThreat?.id === threat?.id ? null : threat);
  };

  const handleAction = (action, threatId) => {
    onThreatAction(action, threatId);
    setSelectedThreat(null);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            <Icon name="Activity" size={20} className="mr-2" />
            Real-Time Threat Timeline
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-text-secondary">Live</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="RotateCcw"
              onClick={() => window.location?.reload()}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
      <div 
        ref={timelineRef}
        className="h-96 overflow-y-auto security-scrollbar"
      >
        {threats?.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary">
            <div className="text-center">
              <Icon name="Shield" size={48} className="mx-auto mb-2 opacity-50" />
              <p>No active threats detected</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {threats?.map((threat) => (
              <div key={threat?.id} className="space-y-2">
                <div
                  className={`p-3 rounded-lg border cursor-pointer security-transition hover:shadow-sm ${
                    selectedThreat?.id === threat?.id ? 'ring-2 ring-primary' : ''
                  } ${getThreatColor(threat?.classification)}`}
                  onClick={() => handleThreatClick(threat)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name={threat?.classification === 'phishing' ? 'AlertTriangle' : 
                                threat?.classification === 'suspicious' ? 'Eye' : 
                                threat?.classification === 'safe' ? 'Shield' : 'Bug'} 
                          size={16} 
                        />
                        <span className="font-medium text-sm capitalize">
                          {threat?.classification}
                        </span>
                      </div>
                      
                      <div className="text-xs text-text-secondary">
                        {formatTime(threat?.timestamp)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className={`text-sm font-mono font-semibold ${getConfidenceColor(threat?.confidence)}`}>
                          {threat?.confidence}%
                        </div>
                        <div className="text-xs text-text-secondary">
                          confidence
                        </div>
                      </div>
                      
                      <Icon 
                        name={selectedThreat?.id === threat?.id ? "ChevronUp" : "ChevronDown"} 
                        size={16} 
                        className="text-text-secondary"
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="text-sm text-text-primary">
                      <span className="font-medium">From:</span> {threat?.source}
                    </div>
                    <div className="text-sm text-text-secondary truncate">
                      <span className="font-medium">Subject:</span> {threat?.subject}
                    </div>
                  </div>
                </div>

                {selectedThreat?.id === threat?.id && (
                  <div className="ml-4 p-3 bg-muted rounded-lg border-l-4 border-primary">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-text-secondary">Email ID:</span>
                          <div className="font-mono text-text-primary">{threat?.emailId}</div>
                        </div>
                        <div>
                          <span className="font-medium text-text-secondary">Source IP:</span>
                          <div className="font-mono text-text-primary">{threat?.sourceIp}</div>
                        </div>
                        <div>
                          <span className="font-medium text-text-secondary">Domain:</span>
                          <div className="font-mono text-text-primary">{threat?.domain}</div>
                        </div>
                        <div>
                          <span className="font-medium text-text-secondary">Response Time:</span>
                          <div className="font-mono text-text-primary">{threat?.responseTime}ms</div>
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-text-secondary text-sm">Threat Explanation:</span>
                        <p className="text-sm text-text-primary mt-1">{threat?.explanation}</p>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          iconName="Shield"
                          onClick={() => handleAction('quarantine', threat?.id)}
                        >
                          Quarantine
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="CheckCircle"
                          onClick={() => handleAction('whitelist', threat?.id)}
                        >
                          Whitelist
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          iconName="Search"
                          onClick={() => handleAction('investigate', threat?.id)}
                        >
                          Investigate
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatTimeline;