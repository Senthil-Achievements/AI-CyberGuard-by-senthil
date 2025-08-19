import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DetailedAnalysisTable = ({ threats, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterClassification, setFilterClassification] = useState('all');
  const [selectedThreats, setSelectedThreats] = useState([]);

  const classificationOptions = [
    { value: 'all', label: 'All Classifications' },
    { value: 'phishing', label: 'Phishing' },
    { value: 'suspicious', label: 'Suspicious' },
    { value: 'safe', label: 'Safe' },
    { value: 'malware', label: 'Malware' }
  ];

  const sortOptions = [
    { value: 'timestamp', label: 'Timestamp' },
    { value: 'confidence', label: 'Confidence' },
    { value: 'classification', label: 'Classification' },
    { value: 'source', label: 'Source' }
  ];

  const filteredAndSortedThreats = threats?.filter(threat => {
      const matchesSearch = threat?.source?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           threat?.subject?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           threat?.domain?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesClassification = filterClassification === 'all' || threat?.classification === filterClassification;
      return matchesSearch && matchesClassification;
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

  const handleSelectThreat = (threatId) => {
    setSelectedThreats(prev => 
      prev?.includes(threatId) 
        ? prev?.filter(id => id !== threatId)
        : [...prev, threatId]
    );
  };

  const handleSelectAll = () => {
    if (selectedThreats?.length === filteredAndSortedThreats?.length) {
      setSelectedThreats([]);
    } else {
      setSelectedThreats(filteredAndSortedThreats?.map(threat => threat?.id));
    }
  };

  const getThreatColor = (classification) => {
    const colorMap = {
      'phishing': 'text-error',
      'suspicious': 'text-warning',
      'safe': 'text-success',
      'malware': 'text-error'
    };
    return colorMap?.[classification] || 'text-text-secondary';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-error';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Table Controls */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search threats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-64"
            />
            
            <Select
              options={classificationOptions}
              value={filterClassification}
              onChange={setFilterClassification}
              className="w-48"
            />
            
            <Select
              options={sortOptions}
              value={sortField}
              onChange={setSortField}
              className="w-40"
            />
          </div>

          <div className="flex items-center space-x-2">
            {selectedThreats?.length > 0 && (
              <span className="text-sm text-text-secondary">
                {selectedThreats?.length} selected
              </span>
            )}
            
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={() => onExport(selectedThreats?.length > 0 ? selectedThreats : 'all')}
            >
              Export
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedThreats?.length === filteredAndSortedThreats?.length && filteredAndSortedThreats?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              
              <th 
                className="p-3 text-left cursor-pointer hover:bg-muted/80 security-transition"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-text-secondary">Timestamp</span>
                  {sortField === 'timestamp' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={14} 
                    />
                  )}
                </div>
              </th>
              
              <th 
                className="p-3 text-left cursor-pointer hover:bg-muted/80 security-transition"
                onClick={() => handleSort('classification')}
              >
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-text-secondary">Classification</span>
                  {sortField === 'classification' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={14} 
                    />
                  )}
                </div>
              </th>
              
              <th 
                className="p-3 text-left cursor-pointer hover:bg-muted/80 security-transition"
                onClick={() => handleSort('confidence')}
              >
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-text-secondary">Confidence</span>
                  {sortField === 'confidence' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={14} 
                    />
                  )}
                </div>
              </th>
              
              <th className="p-3 text-left">
                <span className="text-sm font-medium text-text-secondary">Source</span>
              </th>
              
              <th className="p-3 text-left">
                <span className="text-sm font-medium text-text-secondary">Subject</span>
              </th>
              
              <th className="p-3 text-left">
                <span className="text-sm font-medium text-text-secondary">Actions</span>
              </th>
            </tr>
          </thead>
          
          <tbody>
            {filteredAndSortedThreats?.map((threat) => (
              <tr 
                key={threat?.id}
                className="border-b border-border hover:bg-muted/30 security-transition"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedThreats?.includes(threat?.id)}
                    onChange={() => handleSelectThreat(threat?.id)}
                    className="rounded border-border"
                  />
                </td>
                
                <td className="p-3">
                  <div className="text-sm font-mono text-text-primary">
                    {formatTime(threat?.timestamp)}
                  </div>
                </td>
                
                <td className="p-3">
                  <div className={`flex items-center space-x-2 ${getThreatColor(threat?.classification)}`}>
                    <Icon 
                      name={threat?.classification === 'phishing' ? 'AlertTriangle' : 
                            threat?.classification === 'suspicious' ? 'Eye' : 
                            threat?.classification === 'safe' ? 'Shield' : 'Bug'} 
                      size={14} 
                    />
                    <span className="text-sm font-medium capitalize">
                      {threat?.classification}
                    </span>
                  </div>
                </td>
                
                <td className="p-3">
                  <div className={`text-sm font-mono font-semibold ${getConfidenceColor(threat?.confidence)}`}>
                    {threat?.confidence}%
                  </div>
                </td>
                
                <td className="p-3">
                  <div className="text-sm text-text-primary">
                    <div className="font-medium">{threat?.source}</div>
                    <div className="text-xs text-text-secondary">{threat?.domain}</div>
                  </div>
                </td>
                
                <td className="p-3">
                  <div className="text-sm text-text-primary max-w-xs truncate">
                    {threat?.subject}
                  </div>
                </td>
                
                <td className="p-3">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Eye"
                      onClick={() => {/* View details */}}
                    >
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredAndSortedThreats?.length === 0 && (
        <div className="p-8 text-center text-text-secondary">
          <Icon name="Search" size={48} className="mx-auto mb-2 opacity-50" />
          <p>No threats match your current filters</p>
        </div>
      )}
    </div>
  );
};

export default DetailedAnalysisTable;