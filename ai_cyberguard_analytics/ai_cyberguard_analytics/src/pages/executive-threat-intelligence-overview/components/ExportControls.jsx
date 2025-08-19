import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportControls = ({ onExport }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportScope, setExportScope] = useState('current');
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'Executive PDF Report' },
    { value: 'pptx', label: 'PowerPoint Presentation' },
    { value: 'xlsx', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV Data Export' }
  ];

  const scopeOptions = [
    { value: 'current', label: 'Current View' },
    { value: 'extended', label: 'Extended Period (90 days)' },
    { value: 'quarterly', label: 'Quarterly Report' },
    { value: 'annual', label: 'Annual Summary' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport({ format: exportFormat, scope: exportScope });
      // Simulate export delay
      setTimeout(() => {
        setIsExporting(false);
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  return (
    <div className="security-card">
      <div className="security-card-header">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Export Reports</h3>
          <p className="text-sm text-text-secondary mt-1">
            Generate executive reports for board presentations
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Export Format"
            options={formatOptions}
            value={exportFormat}
            onChange={setExportFormat}
          />
          
          <Select
            label="Report Scope"
            options={scopeOptions}
            value={exportScope}
            onChange={setExportScope}
          />
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-text-secondary">
            Last exported: {new Date()?.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          
          <Button
            variant="default"
            onClick={handleExport}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
            disabled={isExporting}
          >
            {isExporting ? 'Generating...' : 'Export Report'}
          </Button>
        </div>
        
        {/* Quick export buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            iconName="FileText"
            iconPosition="left"
            onClick={() => {
              setExportFormat('pdf');
              setExportScope('current');
              handleExport();
            }}
          >
            Quick PDF
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Presentation"
            iconPosition="left"
            onClick={() => {
              setExportFormat('pptx');
              setExportScope('quarterly');
              handleExport();
            }}
          >
            Board Deck
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportControls;