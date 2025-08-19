import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CorrelationMatrix = ({ data, onCellClick }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [showLabels, setShowLabels] = useState(true);

  // Mock correlation data
  const correlationData = data || {
    variables: [
      'Email Length',
      'Sender Reputation',
      'Link Count',
      'Attachment Count',
      'Subject Keywords',
      'Time of Day',
      'Domain Age',
      'SPF/DKIM Status'
    ],
    matrix: [
      [1.00, -0.23, 0.45, 0.32, 0.67, 0.12, -0.34, -0.56],
      [-0.23, 1.00, -0.12, -0.08, -0.45, 0.23, 0.78, 0.89],
      [0.45, -0.12, 1.00, 0.56, 0.34, -0.09, -0.23, -0.45],
      [0.32, -0.08, 0.56, 1.00, 0.23, -0.12, -0.34, -0.23],
      [0.67, -0.45, 0.34, 0.23, 1.00, 0.08, -0.56, -0.67],
      [0.12, 0.23, -0.09, -0.12, 0.08, 1.00, 0.34, 0.12],
      [-0.34, 0.78, -0.23, -0.34, -0.56, 0.34, 1.00, 0.67],
      [-0.56, 0.89, -0.45, -0.23, -0.67, 0.12, 0.67, 1.00]
    ]
  };

  const getCorrelationColor = (value) => {
    const absValue = Math.abs(value);
    if (absValue >= 0.8) return value > 0 ? '#10b981' : '#ef4444'; // Strong correlation
    if (absValue >= 0.6) return value > 0 ? '#22c55e' : '#f87171'; // Moderate-strong
    if (absValue >= 0.4) return value > 0 ? '#84cc16' : '#fb923c'; // Moderate
    if (absValue >= 0.2) return value > 0 ? '#eab308' : '#fbbf24'; // Weak-moderate
    return '#6b7280'; // Weak correlation
  };

  const getCorrelationStrength = (value) => {
    const absValue = Math.abs(value);
    if (absValue >= 0.8) return 'Very Strong';
    if (absValue >= 0.6) return 'Strong';
    if (absValue >= 0.4) return 'Moderate';
    if (absValue >= 0.2) return 'Weak';
    return 'Very Weak';
  };

  const handleCellClick = (row, col, value) => {
    const cellKey = `${row}-${col}`;
    setSelectedCell(selectedCell === cellKey ? null : cellKey);
    onCellClick && onCellClick({
      variable1: correlationData?.variables?.[row],
      variable2: correlationData?.variables?.[col],
      correlation: value,
      strength: getCorrelationStrength(value)
    });
  };

  const exportMatrix = () => {
    console.log('Exporting correlation matrix...');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Grid3X3" size={20} className="mr-2" />
          Threat Indicator Correlation Matrix
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLabels(!showLabels)}
            iconName={showLabels ? "EyeOff" : "Eye"}
            iconPosition="left"
          >
            {showLabels ? 'Hide' : 'Show'} Labels
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportMatrix}
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
      {/* Correlation Legend */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium text-text-primary mb-3">Correlation Strength</h4>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span>Very Strong Positive (0.8+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
            <span>Strong Positive (0.6-0.8)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }}></div>
            <span>Moderate Positive (0.4-0.6)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6b7280' }}></div>
            <span>Weak (0-0.4)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Strong Negative (-0.6 to -0.8)</span>
          </div>
        </div>
      </div>
      {/* Matrix */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="flex">
            <div className="w-32 flex-shrink-0"></div>
            {correlationData?.variables?.map((variable, index) => (
              <div
                key={index}
                className="w-20 flex-shrink-0 p-2 text-center"
              >
                <div className="text-xs font-medium text-text-secondary transform -rotate-45 origin-center">
                  {showLabels ? variable?.split(' ')?.[0] : `V${index + 1}`}
                </div>
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          {correlationData?.matrix?.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {/* Row Label */}
              <div className="w-32 flex-shrink-0 p-2 flex items-center">
                <span className="text-xs font-medium text-text-secondary">
                  {showLabels ? correlationData?.variables?.[rowIndex] : `Variable ${rowIndex + 1}`}
                </span>
              </div>

              {/* Matrix Cells */}
              {row?.map((value, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`;
                const isSelected = selectedCell === cellKey;
                const isDiagonal = rowIndex === colIndex;
                
                return (
                  <div
                    key={colIndex}
                    className={`w-20 h-16 flex-shrink-0 p-1 cursor-pointer security-transition ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex, value)}
                    title={`${correlationData?.variables?.[rowIndex]} vs ${correlationData?.variables?.[colIndex]}: ${value?.toFixed(3)}`}
                  >
                    <div
                      className={`w-full h-full rounded flex items-center justify-center text-xs font-medium ${
                        isDiagonal ? 'border-2 border-dashed border-text-secondary' : ''
                      }`}
                      style={{
                        backgroundColor: isDiagonal ? 'transparent' : getCorrelationColor(value),
                        color: isDiagonal ? 'var(--color-text-secondary)' : 'white'
                      }}
                    >
                      {isDiagonal ? '1.0' : value?.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Selected Cell Details */}
      {selectedCell && (
        <div className="mt-6 pt-6 border-t border-border">
          {(() => {
            const [row, col] = selectedCell?.split('-')?.map(Number);
            const value = correlationData?.matrix?.[row]?.[col];
            const strength = getCorrelationStrength(value);
            const variable1 = correlationData?.variables?.[row];
            const variable2 = correlationData?.variables?.[col];
            
            return (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-3">
                  Correlation Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Variables:</span>
                    <div className="font-medium text-text-primary">
                      {variable1} ↔ {variable2}
                    </div>
                  </div>
                  <div>
                    <span className="text-text-secondary">Correlation:</span>
                    <div className="font-medium text-text-primary">
                      {value?.toFixed(3)} ({strength})
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-text-secondary">Interpretation:</span>
                    <div className="font-medium text-text-primary">
                      {Math.abs(value) < 0.2 
                        ? "These variables show little to no linear relationship."
                        : value > 0 
                          ? "These variables tend to increase together."
                          : "These variables tend to move in opposite directions."
                      }
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
      {/* Key Insights */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="font-medium text-text-primary mb-3">Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span>Strongest positive correlation: Sender Reputation ↔ SPF/DKIM Status (0.89)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="TrendingDown" size={16} className="text-error" />
              <span>Strongest negative correlation: Subject Keywords ↔ SPF/DKIM Status (-0.67)</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-warning" />
              <span>Email Length shows moderate correlation with Subject Keywords (0.67)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-secondary" />
              <span>Time of Day shows weak correlations with most variables</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationMatrix;