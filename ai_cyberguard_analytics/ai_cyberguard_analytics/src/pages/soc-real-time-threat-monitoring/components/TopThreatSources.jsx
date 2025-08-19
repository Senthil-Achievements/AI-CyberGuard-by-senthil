import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const TopThreatSources = ({ threatSources }) => {
  const getThreatLevelColor = (level) => {
    const colorMap = {
      'critical': 'text-error bg-error/10',
      'high': 'text-warning bg-warning/10',
      'medium': 'text-secondary bg-secondary/10',
      'low': 'text-success bg-success/10'
    };
    return colorMap?.[level] || 'text-text-secondary bg-muted';
  };

  const getThreatLevelIcon = (level) => {
    const iconMap = {
      'critical': 'AlertTriangle',
      'high': 'AlertCircle',
      'medium': 'Info',
      'low': 'CheckCircle'
    };
    return iconMap?.[level] || 'Circle';
  };

  const getCountryFlag = (country) => {
    const flagMap = {
      'US': '🇺🇸',
      'CN': '🇨🇳',
      'RU': '🇷🇺',
      'BR': '🇧🇷',
      'IN': '🇮🇳',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'UK': '🇬🇧'
    };
    return flagMap?.[country] || '🌍';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Globe" size={20} className="mr-2" />
          Top Threat Sources
        </h3>
        <Button
          variant="outline"
          size="sm"
          iconName="ExternalLink"
          onClick={() => {/* Navigate to detailed view */}}
        >
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {threatSources?.map((source, index) => (
          <div
            key={source?.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 security-transition"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full text-sm font-semibold text-text-primary">
                {index + 1}
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCountryFlag(source?.country)}</span>
                  <span className="font-medium text-text-primary">{source?.domain}</span>
                </div>
                <div className="text-sm text-text-secondary">
                  {source?.ip} • {source?.location}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-mono font-semibold text-text-primary">
                  {source?.threatCount}
                </div>
                <div className="text-xs text-text-secondary">
                  threats
                </div>
              </div>

              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getThreatLevelColor(source?.riskLevel)}`}>
                <Icon 
                  name={getThreatLevelIcon(source?.riskLevel)} 
                  size={12} 
                />
                <span className="capitalize">{source?.riskLevel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Unique Sources:</span>
            <span className="font-mono font-semibold text-text-primary">
              {threatSources?.length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Total Threats:</span>
            <span className="font-mono font-semibold text-text-primary">
              {threatSources?.reduce((sum, source) => sum + source?.threatCount, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopThreatSources;