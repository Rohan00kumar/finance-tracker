import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ReceiptText, PiggyBank, DollarSign, Target, User } from 'lucide-react';

const Navbar = ({ activePage, setActivePage }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>
          <DollarSign size={20} color="#fff" />
        </div>
        <span style={styles.logoText}>Finance Tracker</span>
      </div>
      
      <div style={styles.menu}>
        <button 
          style={{...styles.menuItem, ...(activePage === 'dashboard' ? styles.activeMenuItem : {})}}
          onClick={() => setActivePage('dashboard')}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>
        <button 
          style={{...styles.menuItem, ...(activePage === 'transactions' ? styles.activeMenuItem : {})}}
          onClick={() => setActivePage('transactions')}
        >
          <ReceiptText size={18} />
          Transactions
        </button>
        <button 
          style={{...styles.menuItem, ...(activePage === 'budgets' ? styles.activeMenuItem : {})}}
          onClick={() => setActivePage('budgets')}
        >
          <PiggyBank size={18} />
          Budgets
        </button>
        <button 
          style={{...styles.menuItem, ...(activePage === 'savings' ? styles.activeMenuItem : {})}}
          onClick={() => setActivePage('savings')}
        >
          <Target size={18} />
          Savings Goals
        </button>
        <button 
          style={{...styles.menuItem, ...(activePage === 'profile' ? styles.activeMenuItem : {})}}
          onClick={() => setActivePage('profile')}
        >
          <User size={18} />
          Profile
        </button>
      </div>

      <div style={styles.userSection}>
        <span 
          style={{ ...styles.username, cursor: 'pointer', textDecoration: 'underline' }} 
          onClick={() => setActivePage('profile')}
        >
          Hi, {user.username}
        </span>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    background: 'rgba(17, 24, 39, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    fontFamily: 'var(--font-title)',
    background: 'linear-gradient(to right, #fff, #A5B4FC)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(0, 0, 0, 0.2)',
    padding: '0.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeMenuItem: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#fff',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  username: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.875rem',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    background: 'rgba(239, 68, 68, 0.05)',
    color: '#FCA5A5',
    fontSize: '0.875rem',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default Navbar;
