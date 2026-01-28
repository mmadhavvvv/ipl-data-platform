import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import Teams from './pages/Teams';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'matches': return <Matches />;
      case 'teams': return <Teams />;
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
