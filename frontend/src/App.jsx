import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';

const MainAppContent = () => {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [isRegistering, setIsRegistering] = useState(false);

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading Session...</p>
      </div>
    );
  }

  // Auth Screen Routing
  if (!user) {
    if (isRegistering) {
      return <Register onNavigateToLogin={() => setIsRegistering(false)} />;
    }
    return <Login onNavigateToRegister={() => setIsRegistering(true)} />;
  }

  // Dashboard / Operations Routing
  return (
    <div style={styles.appContainer}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      
      <main style={styles.mainContent}>
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'transactions' && <Transactions />}
        {activePage === 'budgets' && <Budgets />}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
};

const styles = {
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#0B0F19',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255, 255, 255, 0.05)',
    borderTopColor: 'var(--primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  mainContent: {
    flex: 1,
    paddingBottom: '4rem', // buffer at the bottom
  },
};

export default App;
