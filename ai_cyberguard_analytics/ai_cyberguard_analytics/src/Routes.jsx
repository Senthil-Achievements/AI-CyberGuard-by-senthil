import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ExecutiveThreatIntelligenceOverview from './pages/executive-threat-intelligence-overview';
import BulkAnalysisProcessingCenter from './pages/bulk-analysis-processing-center';
import AnalyticsPerformanceIntelligence from './pages/analytics-performance-intelligence';
import SOCRealTimeThreatMonitoring from './pages/soc-real-time-threat-monitoring';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AnalyticsPerformanceIntelligence />} />
        <Route path="/executive-threat-intelligence-overview" element={<ExecutiveThreatIntelligenceOverview />} />
        <Route path="/bulk-analysis-processing-center" element={<BulkAnalysisProcessingCenter />} />
        <Route path="/analytics-performance-intelligence" element={<AnalyticsPerformanceIntelligence />} />
        <Route path="/soc-real-time-threat-monitoring" element={<SOCRealTimeThreatMonitoring />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
