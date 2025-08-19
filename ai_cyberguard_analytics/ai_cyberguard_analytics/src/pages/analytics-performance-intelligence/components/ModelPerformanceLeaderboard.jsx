import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModelPerformanceLeaderboard = ({ data, onModelClick }) => {
  const [sortBy, setSortBy] = useState('accuracy');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock data for AI model performance
  const modelData = data || [
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      accuracy: 94.7,
      precision: 92.3,
      recall: 96.1,
      f1Score: 94.2,
      avgResponseTime: 1.8,
      totalProcessed: 15420,
      falsePositives: 127,
      falseNegatives: 89,
      status: 'active',
      lastUpdated: '2025-08-19T14:15:00Z'
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      accuracy: 93.2,
      precision: 91.8,
      recall: 94.6,
      f1Score: 93.2,
      avgResponseTime: 2.1,
      totalProcessed: 12890,
      falsePositives: 156,
      falseNegatives: 98,
      status: 'active',
      lastUpdated: '2025-08-19T14:10:00Z'
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      accuracy: 91.8,
      precision: 89.4,
      recall: 94.2,
      f1Score: 91.7,
      avgResponseTime: 1.5,
      totalProcessed: 18750,
      falsePositives: 198,
      falseNegatives: 134,
      status: 'active',
      lastUpdated: '2025-08-19T14:20:00Z'
    },
    {
      id: 'llama-2-70b',
      name: 'Llama 2 70B',
      provider: 'Meta',
      accuracy: 89.3,
      precision: 87.1,
      recall: 91.5,
      f1Score: 89.2,
      avgResponseTime: 3.2,
      totalProcessed: 9340,
      falsePositives: 234,
      falseNegatives: 167,
      status: 'maintenance',
      lastUpdated: '2025-08-19T12:30:00Z'
    },
    {
      id: 'custom-bert',
      name: 'Custom BERT',
      provider: 'Internal',
      accuracy: 87.6,
      precision: 85.2,
      recall: 90.1,
      f1Score: 87.6,
      avgResponseTime: 0.8,
      totalProcessed: 25680,
      falsePositives: 312,
      falseNegatives: 201,
      status: 'active',
      lastUpdated: '2025-08-19T14:25:00Z'
    }
  ];

  const sortedData = [...modelData]?.sort((a, b) => {
    const aVal = a?.[sortBy];
    const bVal = b?.[sortBy];
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10 border-success/20';
      case 'maintenance': return 'text-warning bg-warning/10 border-warning/20';
      case 'inactive': return 'text-error bg-error/10 border-error/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  const getPerformanceGrade = (accuracy) => {
    if (accuracy >= 95) return { grade: 'A+', color: 'text-success' };
    if (accuracy >= 90) return { grade: 'A', color: 'text-success' };
    if (accuracy >= 85) return { grade: 'B', color: 'text-warning' };
    if (accuracy >= 80) return { grade: 'C', color: 'text-warning' };
    return { grade: 'D', color: 'text-error' };
  };

  const formatTime = (seconds) => {
    return `${seconds?.toFixed(1)}s`;
  };

  const formatNumber = (num) => {
    return num?.toLocaleString();
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-text-secondary hover:text-text-primary security-transition"
    >
      <span>{children}</span>
      {sortBy === field && (
        <Icon 
          name={sortOrder === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
          size={14} 
        />
      )}
    </button>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Trophy" size={20} className="mr-2" />
          Model Performance Leaderboard
        </h3>
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
          iconPosition="left"
        >
          Refresh
        </Button>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2">
                <span className="text-sm font-medium text-text-secondary">Rank</span>
              </th>
              <th className="text-left py-3 px-2">
                <span className="text-sm font-medium text-text-secondary">Model</span>
              </th>
              <th className="text-left py-3 px-2">
                <SortButton field="accuracy">Accuracy</SortButton>
              </th>
              <th className="text-left py-3 px-2">
                <SortButton field="precision">Precision</SortButton>
              </th>
              <th className="text-left py-3 px-2">
                <SortButton field="recall">Recall</SortButton>
              </th>
              <th className="text-left py-3 px-2">
                <SortButton field="avgResponseTime">Response Time</SortButton>
              </th>
              <th className="text-left py-3 px-2">
                <SortButton field="totalProcessed">Processed</SortButton>
              </th>
              <th className="text-left py-3 px-2">
                <span className="text-sm font-medium text-text-secondary">Status</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData?.map((model, index) => {
              const grade = getPerformanceGrade(model?.accuracy);
              return (
                <tr
                  key={model?.id}
                  className="border-b border-border hover:bg-muted/50 cursor-pointer security-transition"
                  onClick={() => onModelClick && onModelClick(model)}
                >
                  <td className="py-4 px-2">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-text-primary">
                        #{index + 1}
                      </span>
                      {index < 3 && (
                        <Icon 
                          name="Award" 
                          size={16} 
                          className={`ml-2 ${
                            index === 0 ? 'text-yellow-500' : 
                            index === 1 ? 'text-gray-400': 'text-amber-600'
                          }`}
                        />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div>
                      <div className="font-medium text-text-primary">{model?.name}</div>
                      <div className="text-sm text-text-secondary">{model?.provider}</div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-text-primary">
                        {model?.accuracy?.toFixed(1)}%
                      </span>
                      <span className={`text-xs font-bold ${grade?.color}`}>
                        {grade?.grade}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-text-primary">{model?.precision?.toFixed(1)}%</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-text-primary">{model?.recall?.toFixed(1)}%</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-text-primary">{formatTime(model?.avgResponseTime)}</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-text-primary">{formatNumber(model?.totalProcessed)}</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(model?.status)}`}>
                      {model?.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {sortedData?.map((model, index) => {
          const grade = getPerformanceGrade(model?.accuracy);
          return (
            <div
              key={model?.id}
              className="border border-border rounded-lg p-4 hover:shadow-md security-transition cursor-pointer"
              onClick={() => onModelClick && onModelClick(model)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-text-primary">#{index + 1}</span>
                  {index < 3 && (
                    <Icon 
                      name="Award" 
                      size={16} 
                      className={
                        index === 0 ? 'text-yellow-500' : 
                        index === 1 ? 'text-gray-400': 'text-amber-600'
                      }
                    />
                  )}
                  <div>
                    <div className="font-medium text-text-primary">{model?.name}</div>
                    <div className="text-sm text-text-secondary">{model?.provider}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(model?.status)}`}>
                  {model?.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-text-secondary">Accuracy:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-text-primary">
                      {model?.accuracy?.toFixed(1)}%
                    </span>
                    <span className={`text-xs font-bold ${grade?.color}`}>
                      {grade?.grade}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Response Time:</span>
                  <div className="font-medium text-text-primary">
                    {formatTime(model?.avgResponseTime)}
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Precision:</span>
                  <div className="font-medium text-text-primary">
                    {model?.precision?.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Processed:</span>
                  <div className="font-medium text-text-primary">
                    {formatNumber(model?.totalProcessed)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-text-primary">
              {modelData?.filter(m => m?.status === 'active')?.length}
            </div>
            <div className="text-xs text-text-secondary">Active Models</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-text-primary">
              {(modelData?.reduce((sum, m) => sum + m?.accuracy, 0) / modelData?.length)?.toFixed(1)}%
            </div>
            <div className="text-xs text-text-secondary">Avg Accuracy</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-text-primary">
              {formatNumber(modelData?.reduce((sum, m) => sum + m?.totalProcessed, 0))}
            </div>
            <div className="text-xs text-text-secondary">Total Processed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-text-primary">
              {(modelData?.reduce((sum, m) => sum + m?.avgResponseTime, 0) / modelData?.length)?.toFixed(1)}s
            </div>
            <div className="text-xs text-text-secondary">Avg Response</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformanceLeaderboard;