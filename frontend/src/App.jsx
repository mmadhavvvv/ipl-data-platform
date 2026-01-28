import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import Teams from './pages/Teams';
import Standings from './pages/Standings';
import Stats from './pages/Stats';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'matches': return <Matches />;
      case 'teams': return <Teams />;
      case 'standings': return <Standings />;
      case 'stats': return <Stats />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
