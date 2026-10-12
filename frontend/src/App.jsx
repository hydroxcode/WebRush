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
  // Theme state with localStorage & URL query persistence
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qTheme = params.get('theme');
      if (qTheme === 'light' || qTheme === 'dark') {
        try {
          localStorage.setItem('insightflow_theme', qTheme);
        } catch (e) {}
        return qTheme;
      }
      const saved = localStorage.getItem('insightflow_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem('insightflow_theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'feedback', 'adaption', 'recommendations', 'issues'].includes(hash)) {
        return hash;
      }
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['overview', 'feedback', 'adaption', 'recommendations', 'issues'].includes(tabParam)) {
        return tabParam;
      }
    }
    return 'overview';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  };

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

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'feedback', 'adaption', 'recommendations', 'issues'].includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans relative selection:bg-sky-500/40 selection:text-white transition-colors duration-300 ${
      isDark ? 'bg-[#060c1e] text-slate-100' : 'bg-[#f1f5f9] text-slate-900'
    }`}>
      {/* Dynamic Liquid Aurora Atmosphere */}
      <div 
        className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-all duration-500" 
        aria-hidden="true"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 12% 18%, rgba(14, 165, 233, 0.22) 0%, transparent 40%), radial-gradient(circle at 88% 16%, rgba(139, 92, 246, 0.26) 0%, transparent 42%), radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.16) 0%, transparent 50%), radial-gradient(circle at 82% 86%, rgba(217, 70, 239, 0.22) 0%, transparent 45%), radial-gradient(circle at 18% 82%, rgba(20, 184, 166, 0.20) 0%, transparent 42%), #060c1e'
            : 'radial-gradient(circle at 12% 18%, rgba(14, 165, 233, 0.14) 0%, transparent 42%), radial-gradient(circle at 88% 16%, rgba(139, 92, 246, 0.16) 0%, transparent 44%), radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.09) 0%, transparent 50%), radial-gradient(circle at 82% 86%, rgba(217, 70, 239, 0.12) 0%, transparent 45%), radial-gradient(circle at 18% 82%, rgba(20, 184, 166, 0.14) 0%, transparent 42%), #f1f5f9'
        }}
      >
        {/* Floating Glowing Fluid Orbs */}
        <div className={`absolute -top-24 -left-24 w-[620px] h-[620px] rounded-full blur-[85px] animate-ambient-1 transition-opacity duration-500 ${
          isDark 
            ? 'bg-gradient-to-tr from-cyan-400/45 via-sky-500/35 to-blue-600/20 opacity-80' 
            : 'bg-gradient-to-tr from-cyan-400/25 via-sky-400/20 to-blue-500/15 opacity-60'
        }`} />
        <div className={`absolute top-1/4 -right-24 w-[660px] h-[660px] rounded-full blur-[90px] animate-ambient-2 transition-opacity duration-500 ${
          isDark 
            ? 'bg-gradient-to-bl from-purple-500/45 via-violet-600/35 to-indigo-700/20 opacity-75' 
            : 'bg-gradient-to-bl from-purple-400/25 via-violet-400/20 to-indigo-500/15 opacity-60'
        }`} />
        <div className={`absolute -bottom-24 left-1/4 w-[600px] h-[600px] rounded-full blur-[85px] animate-ambient-3 transition-opacity duration-500 ${
          isDark 
            ? 'bg-gradient-to-tr from-emerald-400/30 via-teal-500/30 to-cyan-600/20 opacity-70' 
            : 'bg-gradient-to-tr from-emerald-400/20 via-teal-400/15 to-cyan-500/10 opacity-55'
        }`} />
        <div className={`absolute top-2/3 right-1/4 w-[480px] h-[480px] rounded-full blur-[80px] animate-ambient-1 transition-opacity duration-500 ${
          isDark 
            ? 'bg-gradient-to-tl from-fuchsia-500/30 via-pink-600/25 to-purple-600/15 opacity-70' 
            : 'bg-gradient-to-tl from-fuchsia-400/20 via-pink-400/15 to-purple-500/10 opacity-50'
        }`} />
        
        {/* Apple-style Tech Dot Matrix Texture */}
        <div className={`absolute inset-0 [background-size:24px_24px] transition-opacity duration-500 ${
          isDark 
            ? 'bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] opacity-70' 
            : 'bg-[radial-gradient(rgba(15,23,42,0.06)_1px,transparent_1px)] opacity-60'
        }`} />
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
          theme={theme}
          onToggleTheme={toggleTheme}
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
