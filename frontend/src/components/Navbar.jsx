import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ReceiptText, 
  PiggyBank, 
  DollarSign, 
  Target, 
  User, 
  Menu, 
  X 
} from 'lucide-react';

const Navbar = ({ activePage, setActivePage }) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'budgets', label: 'Budgets', icon: PiggyBank },
    { id: 'savings', label: 'Savings Goals', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navHeader}>
        <div style={styles.logoContainer} onClick={() => handleNavClick('dashboard')}>
          <div style={styles.logoIcon}>
            <DollarSign size={20} color="#fff" />
          </div>
          <span style={styles.logoText}>Finance Tracker</span>
        </div>

        <div style={styles.mobileControls}>
          <button 
            style={styles.hamburgerBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} color="#fff" /> : <Menu size={22} color="#fff" />}
          </button>
        </div>
      </div>
      
      {/* Desktop Menu */}
      <div style={{ ...styles.menu, ...styles.desktopMenu }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button 
              key={item.id}
              style={{ ...styles.menuItem, ...(isActive ? styles.activeMenuItem : {}) }}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div style={{ ...styles.userSection, ...styles.desktopUserSection }}>
        <span 
          style={styles.username} 
          onClick={() => handleNavClick('profile')}
        >
          Hi, {user.username}
        </span>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer}>
          <div style={styles.mobileMenuList}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button 
                  key={item.id}
                  style={{ ...styles.mobileMenuItem, ...(isActive ? styles.activeMobileMenuItem : {}) }}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
            <div style={styles.mobileUserBadge} onClick={() => handleNavClick('profile')}>
              <User size={16} color="var(--primary)" />
              <span>Signed in as <b>{user.username}</b></span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.875rem 1.5rem',
    background: 'rgba(17, 24, 39, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexWrap: 'wrap',
  },
  navHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'auto',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: 800,
    fontFamily: 'var(--font-title)',
    background: 'linear-gradient(to right, #fff, #A5B4FC)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  mobileControls: {
    display: 'none',
  },
  hamburgerBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '0.4rem 0.6rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: 'rgba(0, 0, 0, 0.25)',
    padding: '0.3rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.875rem',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeMenuItem: {
    background: 'var(--primary-gradient)',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  username: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#E0E7FF',
    cursor: 'pointer',
    padding: '0.4rem 0.75rem',
    borderRadius: '8px',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    transition: 'all 0.2s ease',
  },
  mobileDrawer: {
    width: '100%',
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  mobileMenuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  mobileMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
  },
  activeMobileMenuItem: {
    background: 'var(--primary-gradient)',
    color: '#fff',
    borderColor: 'transparent',
  },
  mobileUserBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: 'rgba(99, 102, 241, 0.08)',
    borderRadius: '10px',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '0.5rem',
    cursor: 'pointer',
  },
};

// Add responsive layout behavior using JS window match or CSS fallback styles
if (typeof window !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 850px) {
      .desktopMenu { display: none !important; }
      .desktopUserSection { display: none !important; }
      .mobileControls { display: flex !important; }
      nav { width: 100%; }
      .navHeader { width: 100%; justify-content: space-between; }
    }
  `;
  if (!document.getElementById('navbar-responsive-style')) {
    styleEl.id = 'navbar-responsive-style';
    document.head.appendChild(styleEl);
  }
}

export default Navbar;
