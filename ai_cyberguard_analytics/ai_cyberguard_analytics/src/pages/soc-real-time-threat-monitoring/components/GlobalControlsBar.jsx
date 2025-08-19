import React, { useState, useEffect } from 'react';

import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const GlobalControlsBar = ({ 
  environment, 
  setEnvironment, 
  autoRefresh, 
  setAutoRefresh, 
  refreshInterval, 
  setRefreshInterval,
  alertFilters,
  setAlertFilters,
  confidenceThreshold,
  setConfidenceThreshold
}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date());
    }, refreshInterval * 1000);

    return () => clearInterval(timer);
  }, [refreshInterval]);

  const environmentOptions = [
    { value: 'production', label: 'Production' },
    { value: 'staging', label: 'Staging' },
    { value: 'development', label: 'Development' }
  ];

  const refreshIntervalOptions = [
    { value: 5, label: '5 seconds' },
    { value: 15, label: '15 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical Only' },
    { value: 'high', label: 'High & Critical' },
    { value: 'medium', label: 'Medium & Above' }
  ];

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Environment Selector */}
        <div className="lg:col-span-2">
          <Select
            label="Environment"
            options={environmentOptions}
            value={environment}
            onChange={setEnvironment}
            className="w-full"
          />
        </div>

        {/* Auto-refresh Controls */}
        <div className="lg:col-span-3 flex items-center space-x-3">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            iconName={autoRefresh ? "Pause" : "Play"}
            iconPosition="left"
          >
            {autoRefresh ? 'Pause' : 'Start'} Auto-refresh
          </Button>
          
          <Select
            options={refreshIntervalOptions}
            value={refreshInterval}
            onChange={setRefreshInterval}
            className="w-32"
            disabled={!autoRefresh}
          />
        </div>

        {/* Alert Severity Filter */}
        <div className="lg:col-span-2">
          <Select
            label="Alert Filter"
            options={severityOptions}
            value={alertFilters}
            onChange={setAlertFilters}
            className="w-full"
          />
        </div>

        {/* Confidence Threshold Slider */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Confidence Threshold: {confidenceThreshold}%
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-text-secondary">0%</span>
            <input
              type="range"
              min="0"
              max="100"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseInt(e?.target?.value))}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-text-secondary">100%</span>
          </div>
        </div>

        {/* Connection Status */}
        <div className="lg:col-span-2 flex items-center justify-end space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-error'}`}></div>
            <span className="text-sm text-text-secondary">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="text-xs text-text-secondary">
            Last: {formatTime(lastUpdate)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalControlsBar;