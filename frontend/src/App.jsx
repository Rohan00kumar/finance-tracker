import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import SavingsGoals from './pages/SavingsGoals';
import Profile from './pages/Profile';
import Toast from './components/Toast';

const MainAppContent = () => {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: '', type: 'success' });
  };

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading Session...</p>
      </div>
    );
  }

  // Dashboard / Operations Routing
  return (
    <div style={styles.appContainer}>
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      
      <main style={styles.mainContent}>
        {activePage === 'dashboard' && <Dashboard showToast={showToast} setActivePage={setActivePage} />}
        {activePage === 'transactions' && <Transactions showToast={showToast} />}
        {activePage === 'budgets' && <Budgets showToast={showToast} />}
        {activePage === 'savings' && <SavingsGoals showToast={showToast} />}
        {activePage === 'profile' && <Profile showToast={showToast} />}
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
