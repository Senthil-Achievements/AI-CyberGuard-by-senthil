import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ProcessingHistory = ({ history, onExport, onViewDetails }) => {
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const sortOptions = [
    { value: 'timestamp', label: 'Upload Time' },
    { value: 'filename', label: 'File Name' },
    { value: 'processingTime', label: 'Processing Time' },
    { value: 'threatsDetected', label: 'Threats Detected' }
  ];

  const filteredAndSortedHistory = history?.filter(item => {
      const matchesStatus = filterStatus === 'all' || item?.status === filterStatus;
      const matchesSearch = item?.filename?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      return matchesStatus && matchesSearch;
    })?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];
      
      if (sortField === 'timestamp') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectAll = () => {
    if (selectedItems?.length === filteredAndSortedHistory?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAndSortedHistory?.map(item => item?.id));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev?.includes(id) 
        ? prev?.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'text-success', bg: 'bg-success/10', icon: 'CheckCircle' },
      failed: { color: 'text-error', bg: 'bg-error/10', icon: 'XCircle' },
      cancelled: { color: 'text-text-secondary', bg: 'bg-muted', icon: 'MinusCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.cancelled;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color} ${config?.bg}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(1)) + ' ' + sizes?.[i];
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          <Icon 
            name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
            size={14} 
          />
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Input
            type="search"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="sm:w-64"
          />
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            className="sm:w-40"
          />
          <Select
            options={sortOptions}
            value={sortField}
            onChange={setSortField}
            className="sm:w-40"
          />
        </div>

        <div className="flex items-center space-x-2">
          {selectedItems?.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport(selectedItems)}
              iconName="Download"
            >
              Export ({selectedItems?.length})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport('all')}
            iconName="FileText"
          >
            Export All
          </Button>
        </div>
      </div>
      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>
          Showing {filteredAndSortedHistory?.length} of {history?.length} files
        </span>
        {selectedItems?.length > 0 && (
          <span>{selectedItems?.length} selected</span>
        )}
      </div>
      {/* History Table */}
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems?.length === filteredAndSortedHistory?.length && filteredAndSortedHistory?.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <SortableHeader field="filename">File Name</SortableHeader>
                <SortableHeader field="timestamp">Upload Time</SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Size
                </th>
                <SortableHeader field="processingTime">Duration</SortableHeader>
                <SortableHeader field="threatsDetected">Threats</SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {filteredAndSortedHistory?.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <Icon name="FileText" size={48} color="var(--color-text-secondary)" className="mx-auto mb-3" />
                    <p className="text-text-secondary">No processing history found</p>
                  </td>
                </tr>
              ) : (
                filteredAndSortedHistory?.map((item) => (
                  <tr key={item?.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems?.includes(item?.id)}
                        onChange={() => handleSelectItem(item?.id)}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Icon name="FileText" size={16} color="var(--color-text-secondary)" />
                        <div>
                          <div className="text-sm font-medium text-text-primary truncate max-w-xs" title={item?.filename}>
                            {item?.filename}
                          </div>
                          {item?.emailCount && (
                            <div className="text-xs text-text-secondary">
                              {item?.emailCount} emails
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {new Date(item.timestamp)?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {formatFileSize(item?.fileSize)}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {item?.processingTime ? formatDuration(item?.processingTime) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {item?.status === 'completed' ? (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-text-primary">{item?.threatsDetected}</span>
                          {item?.threatBreakdown && (
                            <div className="text-xs text-text-secondary">
                              ({item?.threatBreakdown?.phishing}P, {item?.threatBreakdown?.suspicious}S)
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-text-secondary">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item?.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(item?.id)}
                          iconName="Eye"
                        />
                        {item?.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onExport([item?.id])}
                            iconName="Download"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProcessingHistory;