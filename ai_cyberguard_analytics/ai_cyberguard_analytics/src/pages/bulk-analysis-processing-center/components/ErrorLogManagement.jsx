import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ErrorLogManagement = ({ errorLogs, onResolveError, onExportLogs }) => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [expandedLog, setExpandedLog] = useState(null);

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'file_processing', label: 'File Processing' },
    { value: 'api_error', label: 'API Error' },
    { value: 'validation', label: 'Validation' },
    { value: 'system', label: 'System' },
    { value: 'network', label: 'Network' }
  ];

  const filteredLogs = errorLogs?.filter(log => {
    const matchesSeverity = filterSeverity === 'all' || log?.severity === filterSeverity;
    const matchesCategory = filterCategory === 'all' || log?.category === filterCategory;
    const matchesSearch = log?.message?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         log?.filename?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesSeverity && matchesCategory && matchesSearch;
  });

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { color: 'text-error', bg: 'bg-error/10', icon: 'AlertTriangle' },
      high: { color: 'text-warning', bg: 'bg-warning/10', icon: 'AlertCircle' },
      medium: { color: 'text-secondary', bg: 'bg-secondary/10', icon: 'Info' },
      low: { color: 'text-text-secondary', bg: 'bg-muted', icon: 'Minus' }
    };
    return configs?.[severity] || configs?.low;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      file_processing: 'FileText',
      api_error: 'Wifi',
      validation: 'CheckCircle',
      system: 'Settings',
      network: 'Globe'
    };
    return icons?.[category] || 'AlertCircle';
  };

  const handleSelectAll = () => {
    if (selectedLogs?.length === filteredLogs?.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(filteredLogs?.map(log => log?.id));
    }
  };

  const handleSelectLog = (id) => {
    setSelectedLogs(prev => 
      prev?.includes(id) 
        ? prev?.filter(logId => logId !== id)
        : [...prev, id]
    );
  };

  const handleBulkResolve = () => {
    selectedLogs?.forEach(id => onResolveError(id));
    setSelectedLogs([]);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString();
  };

  const getErrorFrequency = () => {
    const frequency = {};
    errorLogs?.forEach(log => {
      const key = log?.message?.substring(0, 50);
      frequency[key] = (frequency?.[key] || 0) + 1;
    });
    return Object.entries(frequency)?.sort(([,a], [,b]) => b - a)?.slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Error Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-error/10 rounded-lg">
              <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Critical Errors</p>
              <p className="text-xl font-semibold text-text-primary">
                {errorLogs?.filter(log => log?.severity === 'critical')?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Icon name="AlertCircle" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">High Priority</p>
              <p className="text-xl font-semibold text-text-primary">
                {errorLogs?.filter(log => log?.severity === 'high')?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Icon name="Clock" size={20} color="var(--color-secondary)" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Last 24h</p>
              <p className="text-xl font-semibold text-text-primary">
                {errorLogs?.filter(log => 
                  new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                )?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Icon name="CheckCircle" size={20} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Resolved</p>
              <p className="text-xl font-semibold text-text-primary">
                {errorLogs?.filter(log => log?.status === 'resolved')?.length}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Input
            type="search"
            placeholder="Search error logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="sm:w-64"
          />
          <Select
            options={severityOptions}
            value={filterSeverity}
            onChange={setFilterSeverity}
            className="sm:w-40"
          />
          <Select
            options={categoryOptions}
            value={filterCategory}
            onChange={setFilterCategory}
            className="sm:w-40"
          />
        </div>

        <div className="flex items-center space-x-2">
          {selectedLogs?.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkResolve}
                iconName="Check"
              >
                Resolve ({selectedLogs?.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportLogs(selectedLogs)}
                iconName="Download"
              >
                Export
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExportLogs('all')}
            iconName="FileText"
          >
            Export All
          </Button>
        </div>
      </div>
      {/* Error Frequency Analysis */}
      <div className="bg-background border border-border rounded-lg p-4">
        <h4 className="font-medium text-text-primary mb-4 flex items-center space-x-2">
          <Icon name="TrendingUp" size={18} />
          <span>Most Frequent Errors</span>
        </h4>
        <div className="space-y-2">
          {getErrorFrequency()?.map(([error, count], index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm text-text-primary truncate flex-1 mr-4">
                {error}...
              </span>
              <span className="text-sm font-medium text-text-secondary">
                {count} occurrences
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Error Logs Table */}
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-text-primary">Error Logs</h4>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedLogs?.length === filteredLogs?.length && filteredLogs?.length > 0}
                onChange={handleSelectAll}
                className="rounded border-border"
              />
              <span className="text-sm text-text-secondary">Select All</span>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto security-scrollbar">
          {filteredLogs?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="CheckCircle" size={48} color="var(--color-success)" className="mx-auto mb-3" />
              <p className="text-text-secondary">No error logs found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredLogs?.map((log) => {
                const severityConfig = getSeverityConfig(log?.severity);
                const isExpanded = expandedLog === log?.id;

                return (
                  <div key={log?.id} className="p-4 hover:bg-muted/50">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedLogs?.includes(log?.id)}
                        onChange={() => handleSelectLog(log?.id)}
                        className="rounded border-border mt-1"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${severityConfig?.color} ${severityConfig?.bg}`}>
                              <Icon name={severityConfig?.icon} size={12} className="mr-1" />
                              {log?.severity?.charAt(0)?.toUpperCase() + log?.severity?.slice(1)}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-text-secondary bg-muted">
                              <Icon name={getCategoryIcon(log?.category)} size={12} className="mr-1" />
                              {log?.category?.replace('_', ' ')}
                            </span>
                            {log?.status === 'resolved' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-success bg-success/10">
                                <Icon name="CheckCircle" size={12} className="mr-1" />
                                Resolved
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-text-secondary">
                              {formatTimestamp(log?.timestamp)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedLog(isExpanded ? null : log?.id)}
                              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-text-primary font-medium">
                            {log?.message}
                          </p>
                          {log?.filename && (
                            <p className="text-xs text-text-secondary">
                              File: {log?.filename}
                            </p>
                          )}
                        </div>

                        {isExpanded && (
                          <div className="mt-4 p-3 bg-muted rounded-lg space-y-3">
                            {log?.stackTrace && (
                              <div>
                                <h5 className="text-sm font-medium text-text-primary mb-2">Stack Trace</h5>
                                <pre className="text-xs text-text-secondary bg-background p-2 rounded border overflow-x-auto">
                                  {log?.stackTrace}
                                </pre>
                              </div>
                            )}
                            {log?.context && (
                              <div>
                                <h5 className="text-sm font-medium text-text-primary mb-2">Context</h5>
                                <div className="text-xs text-text-secondary space-y-1">
                                  {Object.entries(log?.context)?.map(([key, value]) => (
                                    <div key={key} className="flex">
                                      <span className="font-medium w-20">{key}:</span>
                                      <span>{String(value)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {log?.resolution && (
                              <div>
                                <h5 className="text-sm font-medium text-text-primary mb-2">Resolution</h5>
                                <p className="text-xs text-text-secondary">{log?.resolution}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {log?.status !== 'resolved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onResolveError(log?.id)}
                            iconName="Check"
                            className="text-success hover:text-success"
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onExportLogs([log?.id])}
                          iconName="Download"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorLogManagement;