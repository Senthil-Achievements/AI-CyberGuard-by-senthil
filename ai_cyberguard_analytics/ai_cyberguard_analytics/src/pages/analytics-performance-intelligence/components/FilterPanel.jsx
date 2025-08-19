import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ onFiltersChange }) => {
  const [dateRange, setDateRange] = useState('30d');
  const [threatTypes, setThreatTypes] = useState([]);
  const [confidenceRange, setConfidenceRange] = useState({ min: 0, max: 100 });
  const [comparisonMode, setComparisonMode] = useState('period-over-period');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [showCustomDate, setShowCustomDate] = useState(false);

  const dateRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const threatTypeOptions = [
    { value: 'phishing', label: 'Phishing' },
    { value: 'malware', label: 'Malware' },
    { value: 'spam', label: 'Spam' },
    { value: 'suspicious', label: 'Suspicious' },
    { value: 'safe', label: 'Safe' },
    { value: 'unknown', label: 'Unknown' }
  ];

  const comparisonOptions = [
    { value: 'period-over-period', label: 'Period over Period' },
    { value: 'year-over-year', label: 'Year over Year' },
    { value: 'none', label: 'No Comparison' }
  ];

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    setShowCustomDate(value === 'custom');
    applyFilters({ dateRange: value });
  };

  const handleThreatTypesChange = (values) => {
    setThreatTypes(values);
    applyFilters({ threatTypes: values });
  };

  const handleConfidenceChange = (field, value) => {
    const newRange = { ...confidenceRange, [field]: parseInt(value) || 0 };
    setConfidenceRange(newRange);
    applyFilters({ confidenceRange: newRange });
  };

  const handleComparisonChange = (value) => {
    setComparisonMode(value);
    applyFilters({ comparisonMode: value });
  };

  const applyFilters = (newFilters) => {
    const filters = {
      dateRange,
      threatTypes,
      confidenceRange,
      comparisonMode,
      customDateStart,
      customDateEnd,
      ...newFilters
    };
    onFiltersChange(filters);
  };

  const resetFilters = () => {
    setDateRange('30d');
    setThreatTypes([]);
    setConfidenceRange({ min: 0, max: 100 });
    setComparisonMode('period-over-period');
    setCustomDateStart('');
    setCustomDateEnd('');
    setShowCustomDate(false);
    onFiltersChange({
      dateRange: '30d',
      threatTypes: [],
      confidenceRange: { min: 0, max: 100 },
      comparisonMode: 'period-over-period',
      customDateStart: '',
      customDateEnd: ''
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Filter" size={20} className="mr-2" />
          Advanced Filters
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Date Range */}
        <div className="lg:col-span-1">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={dateRange}
            onChange={handleDateRangeChange}
            placeholder="Select range"
          />
        </div>

        {/* Custom Date Range */}
        {showCustomDate && (
          <>
            <div className="lg:col-span-1">
              <Input
                label="Start Date"
                type="date"
                value={customDateStart}
                onChange={(e) => setCustomDateStart(e?.target?.value)}
              />
            </div>
            <div className="lg:col-span-1">
              <Input
                label="End Date"
                type="date"
                value={customDateEnd}
                onChange={(e) => setCustomDateEnd(e?.target?.value)}
              />
            </div>
          </>
        )}

        {/* Threat Types */}
        <div className="lg:col-span-1">
          <Select
            label="Threat Types"
            options={threatTypeOptions}
            value={threatTypes}
            onChange={handleThreatTypesChange}
            multiple
            searchable
            placeholder="All types"
          />
        </div>

        {/* Confidence Range */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Confidence Range</label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={confidenceRange?.min}
                onChange={(e) => handleConfidenceChange('min', e?.target?.value)}
                min="0"
                max="100"
                className="w-16"
              />
              <span className="text-text-secondary">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={confidenceRange?.max}
                onChange={(e) => handleConfidenceChange('max', e?.target?.value)}
                min="0"
                max="100"
                className="w-16"
              />
            </div>
          </div>
        </div>

        {/* Comparison Mode */}
        <div className="lg:col-span-1">
          <Select
            label="Comparison"
            options={comparisonOptions}
            value={comparisonMode}
            onChange={handleComparisonChange}
            placeholder="Select comparison"
          />
        </div>
      </div>
      {/* Active Filters Display */}
      {(threatTypes?.length > 0 || confidenceRange?.min > 0 || confidenceRange?.max < 100) && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm font-medium text-text-secondary">Active Filters:</span>
            {threatTypes?.map((type) => (
              <span
                key={type}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {threatTypeOptions?.find(opt => opt?.value === type)?.label}
                <button
                  onClick={() => handleThreatTypesChange(threatTypes?.filter(t => t !== type))}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            ))}
            {(confidenceRange?.min > 0 || confidenceRange?.max < 100) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                Confidence: {confidenceRange?.min}% - {confidenceRange?.max}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;