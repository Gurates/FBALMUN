import React, { useState, useEffect } from 'react';
import { Navbar, PageView } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { CommitteesPage } from './components/CommitteesPage';
import { ApplyPage } from './components/ApplyPage';

export const App: React.FC = () => {
  const getInitialPage = (): PageView => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('/committees') || hash.includes('committees')) {
      return 'committees';
    }
    if (path.includes('/apply') || hash.includes('apply')) {
      return 'apply';
    }
    return 'home';
  };

  const initialPage = getInitialPage();

  const [currentPage, setCurrentPage] = useState<PageView>(initialPage);
  const [selectedCommitteeForApply, setSelectedCommitteeForApply] = useState<string>('unwomen');

  useEffect(() => {
    const handlePopState = () => {
      const page = getInitialPage();
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    const targetUrl = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCommitteeForApply = (committeeId: string) => {
    setSelectedCommitteeForApply(committeeId);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-[#f8fafc] flex flex-col">
      <div className="flex flex-col flex-grow">
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

        <main className="flex-grow">
          {currentPage === 'home' && (
            <HomePage onNavigate={handleNavigate} />
          )}

          {currentPage === 'committees' && (
            <CommitteesPage
              onNavigate={handleNavigate}
              onSelectCommitteeForApply={handleSelectCommitteeForApply}
            />
          )}

          {currentPage === 'apply' && (
            <ApplyPage
              initialCommitteeId={selectedCommitteeForApply}
              onNavigate={handleNavigate}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default App;
