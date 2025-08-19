import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import GlobalControlsBar from './components/GlobalControlsBar';
import AlertStrip from './components/AlertStrip';

import ThreatDistribution from './components/ThreatDistribution';
import TopThreatSources from './components/TopThreatSources';
import DetailedAnalysisTable from './components/DetailedAnalysisTable';
import AIModelPerformance from './components/AIModelPerformance';
import { generateThreatExplanation, classifyEmailThreat } from '../../services/threatAnalysisService';
import { analyzeThreatPatterns } from '../../services/aiInsightsService';

const SOCRealTimeThreatMonitoring = () => {
  // Global Controls State
  const [environment, setEnvironment] = useState('production');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(15);
  const [alertFilters, setAlertFilters] = useState('all');
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [activeTab, setActiveTab] = useState('analysis');

  // Enhanced Threat Data State
  const [threatData, setThreatData] = useState({
    activePhishing: 47,
    suspiciousReview: 23,
    falsePositiveRate: 2.8,
    aiResponseTime: 142
  });

  const [threats, setThreats] = useState([
    {
      id: "TH-2025-001",
      timestamp: new Date(Date.now() - 300000),
      classification: "phishing",
      confidence: 94,
      source: "suspicious-sender@fake-bank.com",
      subject: "Urgent: Verify Your Account Information",
      domain: "fake-bank.com",
      sourceIp: "192.168.1.100",
      emailId: "MSG-789456123",
      responseTime: 156,
      explanation: null,
      aiAnalyzing: false
    },
    {
      id: "TH-2025-002",
      timestamp: new Date(Date.now() - 180000),
      classification: "suspicious",
      confidence: 76,
      source: "marketing@legitimate-company.com",
      subject: "Special Offer - Limited Time Only",
      domain: "legitimate-company.com",
      sourceIp: "203.45.67.89",
      emailId: "MSG-789456124",
      responseTime: 134,
      explanation: null,
      aiAnalyzing: false
    },
    {
      id: "TH-2025-003",
      timestamp: new Date(Date.now() - 120000),
      classification: "malware",
      confidence: 98,
      source: "system-update@tech-support.net",
      subject: "Critical System Update Required",
      domain: "tech-support.net",
      sourceIp: "45.123.78.201",
      emailId: "MSG-789456125",
      responseTime: 89,
      explanation: null,
      aiAnalyzing: false
    },
    {
      id: "TH-2025-004",
      timestamp: new Date(Date.now() - 60000),
      classification: "safe",
      confidence: 92,
      source: "notifications@company-internal.com",
      subject: "Weekly Security Report - January 2025",
      domain: "company-internal.com",
      sourceIp: "10.0.1.50",
      emailId: "MSG-789456126",
      responseTime: 67,
      explanation: null,
      aiAnalyzing: false
    }
  ]);

  const [patternAnalysis, setPatternAnalysis] = useState('');
  const [isAnalyzingPatterns, setIsAnalyzingPatterns] = useState(false);

  const [distributionData] = useState([
    { range: '90-100', count: 28 },
    { range: '70-89', count: 45 },
    { range: '50-69', count: 23 },
    { range: '<50', count: 8 }
  ]);

  const [threatSources] = useState([
    {
      id: 1,
      domain: "suspicious-bank.com",
      ip: "192.168.1.100",
      country: "CN",
      location: "Beijing, China",
      threatCount: 47,
      riskLevel: "critical"
    },
    {
      id: 2,
      domain: "fake-paypal.net",
      ip: "203.45.67.89",
      country: "RU",
      location: "Moscow, Russia",
      threatCount: 34,
      riskLevel: "high"
    },
    {
      id: 3,
      domain: "phishing-site.org",
      ip: "45.123.78.201",
      country: "BR",
      location: "São Paulo, Brazil",
      threatCount: 28,
      riskLevel: "high"
    },
    {
      id: 4,
      domain: "malware-host.com",
      ip: "156.78.90.123",
      country: "US",
      location: "New York, USA",
      threatCount: 19,
      riskLevel: "medium"
    },
    {
      id: 5,
      domain: "spam-sender.info",
      ip: "89.234.56.78",
      country: "DE",
      location: "Berlin, Germany",
      threatCount: 15,
      riskLevel: "medium"
    }
  ]);

  const [performanceData] = useState({
    responseTime: [
      { time: '00:00', responseTime: 145 },
      { time: '04:00', responseTime: 132 },
      { time: '08:00', responseTime: 156 },
      { time: '12:00', responseTime: 142 },
      { time: '16:00', responseTime: 138 },
      { time: '20:00', responseTime: 149 }
    ],
    accuracy: [
      { time: '00:00', accuracyRate: 94.2 },
      { time: '04:00', accuracyRate: 95.1 },
      { time: '08:00', accuracyRate: 93.8 },
      { time: '12:00', accuracyRate: 94.7 },
      { time: '16:00', accuracyRate: 95.3 },
      { time: '20:00', accuracyRate: 94.9 }
    ]
  });

  // Load AI pattern analysis on component mount
  useEffect(() => {
    loadPatternAnalysis();
  }, [threats]);

  const loadPatternAnalysis = async () => {
    setIsAnalyzingPatterns(true);
    try {
      const recentThreats = threats?.slice(0, 5)?.map(threat => ({
        classification: threat?.classification,
        confidence: threat?.confidence,
        timestamp: threat?.timestamp?.toISOString(),
        source: threat?.domain
      }));

      const analysis = await analyzeThreatPatterns(recentThreats);
      setPatternAnalysis(analysis);
    } catch (error) {
      console.error('Failed to analyze patterns:', error);
      setPatternAnalysis('Real-time pattern analysis shows consistent threat detection across multiple vectors. Monitoring systems are operating within normal parameters.');
    } finally {
      setIsAnalyzingPatterns(false);
    }
  };

  const handleThreatExplanation = async (threatId) => {
    setThreats(prev => 
      prev?.map(threat => 
        threat?.id === threatId 
          ? { ...threat, aiAnalyzing: true }
          : threat
      )
    );

    try {
      const threat = threats?.find(t => t?.id === threatId);
      const explanation = await generateThreatExplanation({
        classification: threat?.classification,
        confidence: threat?.confidence,
        source: threat?.source,
        subject: threat?.subject,
        domain: threat?.domain
      });

      setThreats(prev => 
        prev?.map(threat => 
          threat?.id === threatId 
            ? { ...threat, explanation, aiAnalyzing: false }
            : threat
        )
      );
    } catch (error) {
      console.error('Failed to generate explanation:', error);
      setThreats(prev => 
        prev?.map(threat => 
          threat?.id === threatId 
            ? { ...threat, aiAnalyzing: false }
            : threat
        )
      );
    }
  };

  // Simulate real-time threat detection with AI classification
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(async () => {
      // Simulate new threat detection
      if (Math.random() > 0.7) {
        try {
          const sampleEmailContent = "Urgent: Your account has been compromised. Click here to verify your identity immediately.";
          const classification = await classifyEmailThreat(sampleEmailContent);
          
          const newThreat = {
            id: `TH-2025-${String(Date.now())?.slice(-3)}`,
            timestamp: new Date(),
            classification: classification?.classification || 'suspicious',
            confidence: classification?.confidence || Math.floor(Math.random() * 40) + 60,
            source: `threat-${Math.floor(Math.random() * 1000)}@suspicious-domain.com`,
            subject: "AI-Detected Threat Alert",
            domain: "suspicious-domain.com",
            sourceIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            emailId: `MSG-${Math.floor(Math.random() * 1000000)}`,
            responseTime: Math.floor(Math.random() * 100) + 50,
            explanation: null,
            aiAnalyzing: false,
            aiReasoning: classification?.reasoning
          };

          setThreats(prev => [newThreat, ...prev?.slice(0, 19)]);
          
          // Update threat counters
          setThreatData(prev => ({
            ...prev,
            activePhishing: prev?.activePhishing + (newThreat?.classification === 'phishing' ? 1 : 0),
            suspiciousReview: prev?.suspiciousReview + (newThreat?.classification === 'suspicious' ? 1 : 0)
          }));
        } catch (error) {
          console.error('Failed to classify new threat:', error);
        }
      }
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate new threat detection
      if (Math.random() > 0.7) {
        const newThreat = {
          id: `TH-2025-${String(Date.now())?.slice(-3)}`,
          timestamp: new Date(),
          classification: ['phishing', 'suspicious', 'safe', 'malware']?.[Math.floor(Math.random() * 4)],
          confidence: Math.floor(Math.random() * 40) + 60,
          source: `threat-${Math.floor(Math.random() * 1000)}@suspicious-domain.com`,
          subject: "Automated Threat Detection Alert",
          domain: "suspicious-domain.com",
          sourceIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          emailId: `MSG-${Math.floor(Math.random() * 1000000)}`,
          responseTime: Math.floor(Math.random() * 100) + 50,
          explanation: null,
          aiAnalyzing: false
        };

        setThreats(prev => [newThreat, ...prev?.slice(0, 19)]);
        
        // Update threat counters
        setThreatData(prev => ({
          ...prev,
          activePhishing: prev?.activePhishing + (newThreat?.classification === 'phishing' ? 1 : 0),
          suspiciousReview: prev?.suspiciousReview + (newThreat?.classification === 'suspicious' ? 1 : 0)
        }));
      }
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const handleThreatAction = (action, threatId) => {
    console.log(`Action: ${action} on threat: ${threatId}`);
    // Implement threat action logic here
    setThreats(prev => prev?.filter(threat => threat?.id !== threatId));
  };

  const handleExport = (selection) => {
    console.log('Exporting data:', selection);
    // Implement export functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="security-container py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              SOC Real-Time Threat Monitoring
            </h1>
            <p className="text-text-secondary">
              AI-powered live email threat detection monitoring and incident response dashboard for security operations center
            </p>
          </div>

          {/* Global Controls */}
          <GlobalControlsBar
            environment={environment}
            setEnvironment={setEnvironment}
            autoRefresh={autoRefresh}
            setAutoRefresh={setAutoRefresh}
            refreshInterval={refreshInterval}
            setRefreshInterval={setRefreshInterval}
            alertFilters={alertFilters}
            setAlertFilters={setAlertFilters}
            confidenceThreshold={confidenceThreshold}
            setConfidenceThreshold={setConfidenceThreshold}
          />

          {/* Alert Strip */}
          <AlertStrip threatData={threatData} />

          {/* AI Pattern Analysis Banner */}
          <div className="mb-6 bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-text-primary">AI Pattern Analysis</span>
                {isAnalyzingPatterns && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                )}
              </div>
            </div>
            <p className="text-sm text-text-secondary mt-2">
              {patternAnalysis}
            </p>
          </div>

          {/* Main Monitoring Area */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Enhanced Threat Timeline - 2/3 width on desktop */}
            <div className="xl:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">Real-Time Threat Timeline</h3>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live Updates</span>
                  </div>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {threats?.map((threat) => (
                    <div key={threat?.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              threat?.classification === 'phishing' ? 'bg-red-100 text-red-800' :
                              threat?.classification === 'malware' ? 'bg-purple-100 text-purple-800' :
                              threat?.classification === 'suspicious'? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {threat?.classification?.toUpperCase()}
                            </span>
                            <span className="text-sm font-medium text-text-secondary">
                              {threat?.confidence}% confidence
                            </span>
                            <span className="text-xs text-text-secondary">
                              {threat?.timestamp?.toLocaleTimeString()}
                            </span>
                          </div>
                          
                          <div className="text-sm text-text-primary mb-1">
                            <strong>From:</strong> {threat?.source}
                          </div>
                          <div className="text-sm text-text-secondary mb-2">
                            <strong>Subject:</strong> {threat?.subject}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-text-secondary">
                            <span>ID: {threat?.emailId}</span>
                            <span>Response: {threat?.responseTime}ms</span>
                            <span>IP: {threat?.sourceIp}</span>
                          </div>
                          
                          {threat?.explanation && (
                            <div className="mt-3 p-3 bg-muted rounded border-l-4 border-primary">
                              <div className="text-sm text-text-secondary">
                                <strong>AI Analysis:</strong> {threat?.explanation}
                              </div>
                            </div>
                          )}
                          
                          {threat?.aiReasoning && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                              <strong>AI Classification Reasoning:</strong> {threat?.aiReasoning}
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex flex-col space-y-2">
                          <button
                            onClick={() => handleThreatExplanation(threat?.id)}
                            disabled={threat?.aiAnalyzing}
                            className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/80 disabled:opacity-50"
                          >
                            {threat?.aiAnalyzing ? 'Analyzing...' : 'AI Explain'}
                          </button>
                          
                          <button
                            onClick={() => handleThreatAction('quarantine', threat?.id)}
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Quarantine
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - 1/3 width on desktop */}
            <div className="space-y-6">
              <ThreatDistribution distributionData={distributionData} />
              <TopThreatSources threatSources={threatSources} />
            </div>
          </div>

          {/* Tabbed Interface */}
          <div className="bg-card border border-border rounded-lg">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm security-transition ${
                    activeTab === 'analysis' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                  }`}
                >
                  Detailed Threat Analysis
                </button>
                <button
                  onClick={() => setActiveTab('performance')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm security-transition ${
                    activeTab === 'performance'
                      ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                  }`}
                >
                  AI Model Performance
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'analysis' ? (
                <DetailedAnalysisTable 
                  threats={threats}
                  onExport={handleExport}
                />
              ) : (
                <AIModelPerformance performanceData={performanceData} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SOCRealTimeThreatMonitoring;