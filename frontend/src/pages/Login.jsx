import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, LogIn } from 'lucide-react';

const Login = ({ onNavigateToRegister }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-card" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoIcon}>💰</div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Enter your credentials to access your finance tracker</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={styles.inputContainer}>
              <User size={18} style={styles.inputIcon} />
              <input
                type="text"
                className="form-input"
                style={styles.inputWithIcon}
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Password</label>
            <div style={styles.inputContainer}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                className="form-input"
                style={styles.inputWithIcon}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <LogIn size={18} />}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?{' '}
          <button style={styles.linkBtn} onClick={onNavigateToRegister} disabled={loading}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '2.5rem 2rem',
    borderRadius: 'var(--radius-lg)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logoIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.75rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    marginBottom: '0.5rem',
    background: 'linear-gradient(to right, #fff, #A5B4FC)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  inputWithIcon: {
    paddingLeft: '2.75rem',
  },
  submitBtn: {
    width: '100%',
    padding: '0.875rem',
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#FCA5A5',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
  },
};

export default Login;
