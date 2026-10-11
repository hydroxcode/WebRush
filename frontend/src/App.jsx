import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import FeedbackExplorer from './components/FeedbackExplorer';
import AdaptionStudio from './components/AdaptionStudio';
import RecommendationHub from './components/RecommendationHub';
import IssueTracker from './components/IssueTracker';
import AddFeedbackModal from './components/AddFeedbackModal';
import UploadCsvModal from './components/UploadCsvModal';
import ReportModal from './components/ReportModal';
import { fetchAnalyticsSummary, resetSampleData } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const loadSummary = async () => {
    try {
      const data = await fetchAnalyticsSummary();
      setStats(data);
    } catch (err) {
      console.error('Failed to load analytics summary:', err);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleResetSample = async () => {
    if (!window.confirm('Reset and reload the original 7,000 customer feedback records?')) return;
    setIsResetting(true);
    try {
      await resetSampleData();
      await loadSummary();
      alert('Sample dataset reset successfully with 7,000 records!');
    } catch (err) {
      alert('Failed to reset dataset: ' + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        activeTab={activeTab}
        stats={stats}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onResetSample={handleResetSample}
          isResetting={isResetting}
        />

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <DashboardOverview 
              stats={stats} 
              onNavigateTab={(tab) => setActiveTab(tab)} 
            />
          )}

          {activeTab === 'feedback' && (
            <FeedbackExplorer
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onPromoteToIssue={() => setActiveTab('issues')}
            />
          )}

          {activeTab === 'adaption' && (
            <AdaptionStudio />
          )}

          {activeTab === 'recommendations' && (
            <RecommendationHub 
              onNavigateTab={(tab) => setActiveTab(tab)} 
            />
          )}

          {activeTab === 'issues' && (
            <IssueTracker />
          )}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <AddFeedbackModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFeedbackAdded={() => {
          loadSummary();
        }}
      />

      <UploadCsvModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onCsvUploaded={() => {
          loadSummary();
        }}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
