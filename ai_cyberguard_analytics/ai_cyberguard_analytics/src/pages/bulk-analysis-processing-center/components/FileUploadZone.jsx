import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadZone = ({ onFileUpload, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    setUploadError('');
    const validFiles = [];
    const invalidFiles = [];

    files?.forEach(file => {
      if (file?.type === 'text/plain' || file?.name?.endsWith('.txt')) {
        if (file?.size <= 50 * 1024 * 1024) { // 50MB limit
          validFiles?.push(file);
        } else {
          invalidFiles?.push(`${file?.name} (too large)`);
        }
      } else {
        invalidFiles?.push(`${file?.name} (invalid format)`);
      }
    });

    if (invalidFiles?.length > 0) {
      setUploadError(`Invalid files: ${invalidFiles?.join(', ')}`);
    }

    if (validFiles?.length > 0) {
      onFileUpload(validFiles);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="security-card">
      <div className="security-card-header">
        <div className="flex items-center space-x-2">
          <Icon name="Upload" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">File Upload</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-text-secondary">Supported: .txt files</span>
          <span className="text-xs text-text-secondary">Max: 50MB</span>
        </div>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,text/plain"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${isDragOver ? 'bg-primary/10' : 'bg-muted'}`}>
            <Icon 
              name={isDragOver ? "Download" : "Upload"} 
              size={32} 
              color={isDragOver ? "var(--color-primary)" : "var(--color-text-secondary)"} 
            />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium text-text-primary">
              {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-text-secondary">
              or click to browse your computer
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleBrowseClick}
            disabled={isProcessing}
            iconName="FolderOpen"
            iconPosition="left"
          >
            Browse Files
          </Button>

          {uploadError && (
            <div className="flex items-center space-x-2 text-error text-sm">
              <Icon name="AlertCircle" size={16} />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} color="var(--color-secondary)" className="mt-0.5" />
          <div className="text-xs text-text-secondary space-y-1">
            <p><strong>Supported formats:</strong> Plain text files (.txt)</p>
            <p><strong>File size limit:</strong> Maximum 50MB per file</p>
            <p><strong>Batch processing:</strong> Up to 100 files simultaneously</p>
            <p><strong>Content:</strong> Email content for threat analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;