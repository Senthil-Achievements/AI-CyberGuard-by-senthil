import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProcessingQueue = ({ queue, onPause, onResume, onCancel, onReorder }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'text-secondary';
      case 'completed':
        return 'text-success';
      case 'failed':
        return 'text-error';
      case 'paused':
        return 'text-warning';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return 'Loader2';
      case 'completed':
        return 'CheckCircle';
      case 'failed':
        return 'XCircle';
      case 'paused':
        return 'Pause';
      case 'queued':
        return 'Clock';
      default:
        return 'FileText';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const calculateETA = (progress, startTime) => {
    if (progress === 0) return 'Calculating...';
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = (elapsed / progress) * (100 - progress);
    return formatDuration(Math.round(remaining));
  };

  return (
    <div className="security-card">
      <div className="security-card-header">
        <div className="flex items-center space-x-2">
          <Icon name="List" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">Processing Queue</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">
            {queue?.filter(item => item?.status === 'processing')?.length} active
          </span>
          <span className="text-sm text-text-secondary">•</span>
          <span className="text-sm text-text-secondary">
            {queue?.filter(item => item?.status === 'queued')?.length} queued
          </span>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto security-scrollbar">
        {queue?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Inbox" size={48} color="var(--color-text-secondary)" className="mx-auto mb-3" />
            <p className="text-text-secondary">No files in processing queue</p>
          </div>
        ) : (
          queue?.map((item, index) => (
            <div key={item?.id} className="border border-border rounded-lg p-4 bg-background">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <Icon 
                    name={getStatusIcon(item?.status)} 
                    size={20} 
                    className={`${getStatusColor(item?.status)} ${item?.status === 'processing' ? 'animate-spin' : ''} mt-0.5`}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-text-primary truncate" title={item?.filename}>
                      {item?.filename}
                    </h4>
                    <div className="flex items-center space-x-4 text-xs text-text-secondary mt-1">
                      <span>{formatFileSize(item?.fileSize)}</span>
                      <span>•</span>
                      <span>Position: {index + 1}</span>
                      {item?.status === 'processing' && (
                        <>
                          <span>•</span>
                          <span>ETA: {calculateETA(item?.progress, item?.startTime)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-3">
                  {item?.status === 'processing' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPause(item?.id)}
                      iconName="Pause"
                      className="text-warning hover:text-warning"
                    />
                  )}
                  {item?.status === 'paused' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResume(item?.id)}
                      iconName="Play"
                      className="text-success hover:text-success"
                    />
                  )}
                  {(item?.status === 'queued' || item?.status === 'paused') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCancel(item?.id)}
                      iconName="X"
                      className="text-error hover:text-error"
                    />
                  )}
                  {item?.status === 'queued' && index > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReorder(item?.id, 'up')}
                      iconName="ChevronUp"
                    />
                  )}
                  {item?.status === 'queued' && index < queue?.length - 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReorder(item?.id, 'down')}
                      iconName="ChevronDown"
                    />
                  )}
                </div>
              </div>

              {item?.status === 'processing' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-text-secondary">
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
              )}

              {item?.status === 'completed' && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-success">
                    Completed in {formatDuration(item?.processingTime)}
                  </span>
                  <span className="text-text-secondary">
                    {item?.threatsDetected} threats detected
                  </span>
                </div>
              )}

              {item?.status === 'failed' && (
                <div className="text-xs text-error">
                  Error: {item?.errorMessage}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {queue?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Total files: {queue?.length}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => queue?.filter(item => item?.status === 'processing')?.forEach(item => onPause(item?.id))}
                iconName="PauseCircle"
              >
                Pause All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => queue?.filter(item => item?.status === 'queued')?.forEach(item => onCancel(item?.id))}
                iconName="StopCircle"
              >
                Clear Queue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingQueue;