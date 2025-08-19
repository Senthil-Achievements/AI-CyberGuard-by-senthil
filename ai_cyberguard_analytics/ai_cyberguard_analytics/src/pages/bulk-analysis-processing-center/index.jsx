import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import FileUploadZone from './components/FileUploadZone';
import ProcessingQueue from './components/ProcessingQueue';
import SystemMonitoring from './components/SystemMonitoring';
import ProcessingHistory from './components/ProcessingHistory';
import BatchResultsVisualization from './components/BatchResultsVisualization';
import ErrorLogManagement from './components/ErrorLogManagement';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const BulkAnalysisProcessingCenter = () => {
  const [activeTab, setActiveTab] = useState('processing');
  const [processingQueue, setProcessingQueue] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({});
  const [processingHistory, setProcessingHistory] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize mock data
  useEffect(() => {
    initializeMockData();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      updateSystemMetrics();
      updateProcessingQueue();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const initializeMockData = () => {
    // Mock processing queue
    const mockQueue = [
      {
        id: 'pq-001',
        filename: 'email_batch_morning_2025.txt',
        fileSize: 15728640,
        status: 'processing',
        progress: 67,
        startTime: Date.now() - 180000,
        processingSpeed: 45,
        emailCount: 1250
      },
      {
        id: 'pq-002',
        filename: 'customer_emails_jan19.txt',
        fileSize: 8912345,
        status: 'queued',
        progress: 0,
        emailCount: 890
      },
      {
        id: 'pq-003',
        filename: 'support_tickets_batch.txt',
        fileSize: 23456789,
        status: 'paused',
        progress: 23,
        startTime: Date.now() - 300000,
        processingSpeed: 32,
        emailCount: 2100
      },
      {
        id: 'pq-004',
        filename: 'marketing_emails_analysis.txt',
        fileSize: 12345678,
        status: 'completed',
        progress: 100,
        processingTime: 145,
        threatsDetected: 12,
        emailCount: 1450
      }
    ];

    // Mock system metrics
    const mockSystemMetrics = {
      cpu: {
        usage: 72,
        cores: 8,
        frequency: 3.2
      },
      memory: {
        used: 12884901888,
        total: 17179869184,
        percentage: 75
      },
      disk: {
        used: 536870912000,
        total: 1073741824000,
        percentage: 50
      },
      network: {
        throughput: 125,
        utilization: 45,
        packetsPerSecond: 1250
      },
      apiLimits: [
        {
          service: 'OpenAI GPT-4',
          used: 8500,
          limit: 10000,
          usage: 85,
          resetTime: '23:45'
        },
        {
          service: 'HuggingFace API',
          used: 2100,
          limit: 5000,
          usage: 42,
          resetTime: '00:00'
        },
        {
          service: 'Email Parser',
          used: 15600,
          limit: 20000,
          usage: 78,
          resetTime: '12:00'
        }
      ]
    };

    // Mock processing history
    const mockHistory = [
      {
        id: 'ph-001',
        filename: 'daily_emails_jan18_2025.txt',
        timestamp: '2025-01-18T14:30:00Z',
        fileSize: 25165824,
        processingTime: 187,
        threatsDetected: 23,
        threatBreakdown: { phishing: 15, suspicious: 8 },
        status: 'completed',
        emailCount: 2890,
        exportStatus: 'available'
      },
      {
        id: 'ph-002',
        filename: 'customer_feedback_batch.txt',
        timestamp: '2025-01-18T09:15:00Z',
        fileSize: 18874368,
        processingTime: 156,
        threatsDetected: 7,
        threatBreakdown: { phishing: 3, suspicious: 4 },
        status: 'completed',
        emailCount: 1567,
        exportStatus: 'available'
      },
      {
        id: 'ph-003',
        filename: 'newsletter_analysis.txt',
        timestamp: '2025-01-17T16:45:00Z',
        fileSize: 12582912,
        processingTime: 0,
        threatsDetected: 0,
        status: 'failed',
        emailCount: 0,
        errorMessage: 'Invalid file format detected'
      },
      {
        id: 'ph-004',
        filename: 'security_alerts_batch.txt',
        timestamp: '2025-01-17T11:20:00Z',
        fileSize: 31457280,
        processingTime: 234,
        threatsDetected: 45,
        threatBreakdown: { phishing: 28, suspicious: 17 },
        status: 'completed',
        emailCount: 3240,
        exportStatus: 'available'
      },
      {
        id: 'ph-005',
        filename: 'user_reports_jan16.txt',
        timestamp: '2025-01-16T13:10:00Z',
        fileSize: 0,
        processingTime: 0,
        threatsDetected: 0,
        status: 'cancelled',
        emailCount: 0
      }
    ];

    // Mock error logs
    const mockErrorLogs = [
      {
        id: 'el-001',
        timestamp: '2025-01-19T14:15:00Z',
        severity: 'critical',
        category: 'api_error',
        message: 'OpenAI API rate limit exceeded during batch processing',
        filename: 'large_email_batch.txt',
        status: 'active',
        stackTrace: `APIError: Rate limit exceeded\n  at processEmailBatch (processor.js:145)\n  at analyzeFile (analyzer.js:67)`,
        context: {
          batchSize: 5000,
          apiEndpoint: '/v1/chat/completions',
          retryCount: 3
        }
      },
      {
        id: 'el-002',
        timestamp: '2025-01-19T13:45:00Z',
        severity: 'high',
        category: 'file_processing',
        message: 'File parsing failed due to encoding issues',
        filename: 'corrupted_emails.txt',
        status: 'active',
        context: {
          encoding: 'UTF-8',
          fileSize: '25MB',
          lineNumber: 1247
        }
      },
      {
        id: 'el-003',
        timestamp: '2025-01-19T12:30:00Z',
        severity: 'medium',
        category: 'validation',
        message: 'Email format validation failed for multiple entries',
        filename: 'mixed_format_emails.txt',
        status: 'resolved',
        resolution: 'Applied automatic format correction and reprocessed successfully',
        context: {
          invalidEntries: 23,
          totalEntries: 1890
        }
      },
      {
        id: 'el-004',
        timestamp: '2025-01-19T11:20:00Z',
        severity: 'low',
        category: 'system',
        message: 'Temporary disk space warning during processing',
        status: 'resolved',
        resolution: 'Cleared temporary files and resumed processing',
        context: {
          diskUsage: '89%',
          availableSpace: '2.1GB'
        }
      }
    ];

    setProcessingQueue(mockQueue);
    setSystemMetrics(mockSystemMetrics);
    setProcessingHistory(mockHistory);
    setErrorLogs(mockErrorLogs);
  };

  const updateSystemMetrics = () => {
    setSystemMetrics(prev => ({
      ...prev,
      cpu: {
        ...prev?.cpu,
        usage: Math.max(30, Math.min(95, prev?.cpu?.usage + (Math.random() - 0.5) * 10))
      },
      memory: {
        ...prev?.memory,
        percentage: Math.max(40, Math.min(90, prev?.memory?.percentage + (Math.random() - 0.5) * 8))
      }
    }));
  };

  const updateProcessingQueue = () => {
    setProcessingQueue(prev => prev?.map(item => {
      if (item?.status === 'processing') {
        const newProgress = Math.min(100, item?.progress + Math.random() * 5);
        return {
          ...item,
          progress: newProgress,
          processingSpeed: Math.max(20, Math.min(60, item?.processingSpeed + (Math.random() - 0.5) * 10))
        };
      }
      return item;
    }));
  };

  const handleFileUpload = (files) => {
    setIsProcessing(true);
    
    const newQueueItems = files?.map((file, index) => ({
      id: `pq-${Date.now()}-${index}`,
      filename: file?.name,
      fileSize: file?.size,
      status: 'queued',
      progress: 0,
      emailCount: Math.floor(file?.size / 1000) // Rough estimate
    }));

    setProcessingQueue(prev => [...prev, ...newQueueItems]);
    
    // Simulate processing start
    setTimeout(() => {
      setProcessingQueue(prev => prev?.map(item => 
        newQueueItems?.find(newItem => newItem?.id === item?.id)
          ? { ...item, status: 'processing', startTime: Date.now(), processingSpeed: 35 }
          : item
      ));
      setIsProcessing(false);
    }, 2000);
  };

  const handlePauseProcessing = (id) => {
    setProcessingQueue(prev => prev?.map(item => 
      item?.id === id ? { ...item, status: 'paused' } : item
    ));
  };

  const handleResumeProcessing = (id) => {
    setProcessingQueue(prev => prev?.map(item => 
      item?.id === id ? { ...item, status: 'processing', startTime: Date.now() } : item
    ));
  };

  const handleCancelProcessing = (id) => {
    setProcessingQueue(prev => prev?.filter(item => item?.id !== id));
  };

  const handleReorderQueue = (id, direction) => {
    setProcessingQueue(prev => {
      const index = prev?.findIndex(item => item?.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev?.length) return prev;
      
      const newQueue = [...prev];
      [newQueue[index], newQueue[newIndex]] = [newQueue?.[newIndex], newQueue?.[index]];
      return newQueue;
    });
  };

  const handleExportHistory = (selection) => {
    console.log('Exporting history:', selection);
    // Implement export functionality
  };

  const handleViewHistoryDetails = (id) => {
    console.log('Viewing details for:', id);
    // Implement details view
  };

  const handleResolveError = (id) => {
    setErrorLogs(prev => prev?.map(log => 
      log?.id === id ? { ...log, status: 'resolved', resolution: 'Manually resolved by administrator' } : log
    ));
  };

  const handleExportErrorLogs = (selection) => {
    console.log('Exporting error logs:', selection);
    // Implement export functionality
  };

  const tabs = [
    { id: 'processing', label: 'Processing', icon: 'Play', count: processingQueue?.filter(item => item?.status === 'processing')?.length },
    { id: 'history', label: 'History', icon: 'Clock', count: processingHistory?.length },
    { id: 'visualization', label: 'Analytics', icon: 'BarChart3' },
    { id: 'errors', label: 'Error Logs', icon: 'AlertTriangle', count: errorLogs?.filter(log => log?.status === 'active')?.length }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="security-container py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="Database" size={24} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Bulk Analysis Processing Center</h1>
                <p className="text-text-secondary">
                  Comprehensive file upload analytics and batch email processing management
                </p>
              </div>
            </div>
          </div>

          {/* Upload and Monitoring Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <FileUploadZone 
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
            />
            
            <div className="space-y-6">
              <ProcessingQueue
                queue={processingQueue}
                onPause={handlePauseProcessing}
                onResume={handleResumeProcessing}
                onCancel={handleCancelProcessing}
                onReorder={handleReorderQueue}
              />
            </div>
          </div>

          {/* System Monitoring */}
          <div className="mb-8">
            <SystemMonitoring systemMetrics={systemMetrics} />
          </div>

          {/* Tabbed Interface */}
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                    {tab?.count !== undefined && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-text-secondary'
                      }`}>
                        {tab?.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'processing' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">Active Processing</h3>
                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                        <span>Real-time updates</span>
                      </div>
                      <span>•</span>
                      <span>Refresh every 10 seconds</span>
                    </div>
                  </div>
                  
                  {processingQueue?.filter(item => item?.status === 'processing')?.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Play" size={48} color="var(--color-text-secondary)" className="mx-auto mb-3" />
                      <p className="text-text-secondary">No active processing jobs</p>
                      <p className="text-sm text-text-secondary mt-1">Upload files to start batch processing</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {processingQueue?.filter(item => item?.status === 'processing')?.map(item => (
                          <div key={item?.id} className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-text-primary">{item?.filename}</h4>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePauseProcessing(item?.id)}
                                  iconName="Pause"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCancelProcessing(item?.id)}
                                  iconName="X"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-text-secondary">
                                <span>Progress: {item?.progress}%</span>
                                <span>Speed: {item?.processingSpeed} emails/min</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-secondary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${item?.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <ProcessingHistory
                  history={processingHistory}
                  onExport={handleExportHistory}
                  onViewDetails={handleViewHistoryDetails}
                />
              )}

              {activeTab === 'visualization' && (
                <BatchResultsVisualization
                  batchData={processingHistory}
                  processingMetrics={systemMetrics}
                />
              )}

              {activeTab === 'errors' && (
                <ErrorLogManagement
                  errorLogs={errorLogs}
                  onResolveError={handleResolveError}
                  onExportLogs={handleExportErrorLogs}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BulkAnalysisProcessingCenter;