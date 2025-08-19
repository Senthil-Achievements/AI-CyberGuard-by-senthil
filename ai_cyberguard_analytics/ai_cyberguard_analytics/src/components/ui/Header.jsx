import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRange, setTimeRange] = useState('24h');
  const [userRole, setUserRole] = useState('analyst');
  const [alertCount, setAlertCount] = useState(3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time alert updates
  useEffect(() => {
    const alertTimer = setInterval(() => {
      setAlertCount(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 30000);
    return () => clearInterval(alertTimer);
  }, []);

  const navigationItems = [
    {
      label: 'Overview',
      path: '/executive-threat-intelligence-overview',
      icon: 'BarChart3',
      description: 'Executive threat intelligence dashboard'
    },
    {
      label: 'Monitoring',
      path: '/soc-real-time-threat-monitoring',
      icon: 'Shield',
      description: 'Real-time SOC operations center'
    },
    {
      label: 'Analytics',
      path: '/analytics-performance-intelligence',
      icon: 'TrendingUp',
      description: 'Performance intelligence and trends'
    },
    {
      label: 'Processing',
      path: '/bulk-analysis-processing-center',
      icon: 'Database',
      description: 'Bulk analysis processing center'
    }
  ];

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const userRoleOptions = [
    { value: 'ciso', label: 'CISO' },
    { value: 'analyst', label: 'SOC Analyst' },
    { value: 'manager', label: 'Security Manager' },
    { value: 'compliance', label: 'Compliance Officer' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleAlertClick = () => {
    navigate('/soc-real-time-threat-monitoring');
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="Shield" size={24} color="white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-text-primary leading-tight">
              AI CyberGuard
            </h1>
            <span className="text-xs text-text-secondary font-medium">
              Analytics
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`nav-item ${isActivePath(item?.path) ? 'nav-item-active' : ''}`}
              title={item?.description}
            >
              <Icon name={item?.icon} size={18} className="mr-2" />
              {item?.label}
            </button>
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          {/* Time Display */}
          <div className="hidden md:flex flex-col items-end text-right">
            <div className="text-sm font-mono font-semibold text-text-primary">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-text-secondary">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="hidden md:block">
            <Select
              options={timeRangeOptions}
              value={timeRange}
              onChange={setTimeRange}
              placeholder="Time Range"
              className="w-32"
            />
          </div>

          {/* Alert Indicator */}
          <button
            onClick={handleAlertClick}
            className="relative p-2 rounded-lg hover:bg-muted security-transition focus-security"
            title={`${alertCount} active alerts`}
          >
            <Icon 
              name="AlertTriangle" 
              size={20} 
              color={alertCount > 0 ? 'var(--color-warning)' : 'var(--color-text-secondary)'} 
            />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-error rounded-full animate-pulse-security">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </button>

          {/* User Role Switcher */}
          <div className="hidden sm:block">
            <Select
              options={userRoleOptions}
              value={userRole}
              onChange={setUserRole}
              placeholder="Role"
              className="w-36"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted security-transition focus-security"
            aria-label="Toggle navigation menu"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border animate-slide-down">
          <nav className="px-6 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg security-transition ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-primary hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} className="mr-3" />
                <div>
                  <div className="font-medium">{item?.label}</div>
                  <div className="text-xs opacity-75">{item?.description}</div>
                </div>
              </button>
            ))}
          </nav>

          {/* Mobile Controls */}
          <div className="px-6 py-4 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">Time Range</span>
              <Select
                options={timeRangeOptions}
                value={timeRange}
                onChange={setTimeRange}
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">Role</span>
              <Select
                options={userRoleOptions}
                value={userRole}
                onChange={setUserRole}
                className="w-36"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;