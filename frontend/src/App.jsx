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
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans relative selection:bg-sky-500/30 selection:text-sky-200">
      {/* Atmospheric Fluid Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-sky-500/20 via-indigo-600/15 to-transparent blur-[120px] animate-ambient-1" />
        <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-purple-500/15 via-pink-600/10 to-transparent blur-[130px] animate-ambient-2" />
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent blur-[140px] animate-ambient-1" />
        {/* Subtle glass micro-grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px] opacity-60" />
      </div>

      {/* App Shell */}
      <div className="relative z-10 flex flex-col min-h-screen">
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
    </div>
  );
}
