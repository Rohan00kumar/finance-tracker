import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, 
  Trash2, 
  X, 
  Target, 
  DollarSign, 
  Calendar, 
  CheckCircle,
  TrendingUp,
  Edit2
} from 'lucide-react';

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('ADD'); // ADD or EDIT
  const [editingId, setEditingId] = useState(null);
  
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/savings');
      setGoals(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load savings goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const openAddModal = () => {
    setFormMode('ADD');
    setEditingId(null);
    setTitle('');
    setTargetAmount('');
    setCurrentAmount('0');
    setTargetDate('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (goal) => {
    setFormMode('EDIT');
    setEditingId(goal.id);
    setTitle(goal.title);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setTargetDate(goal.targetDate);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title || !targetAmount || !targetDate) {
      setFormError('Title, target amount, and target date are required');
      return;
    }

    if (parseFloat(targetAmount) <= 0) {
      setFormError('Target amount must be greater than zero');
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        title,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount || 0),
        targetDate
      };
      
      if (formMode === 'ADD') {
        await api.post('/savings', payload);
      } else {
        await api.put(`/savings/${editingId}`, payload);
      }
      fetchGoals();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError('Failed to save savings goal');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this savings goal?')) return;
    try {
      await api.delete(`/savings/${id}`);
      fetchGoals();
    } catch (err) {
      console.error(err);
      alert('Failed to delete savings goal');
    }
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading Goals...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Savings Goals</h1>
          <p style={styles.subtitle}>Set milestones and track your savings progress</p>
        </div>
        
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Create Savings Goal
        </button>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      {goals.length === 0 ? (
        <div className="glass-card" style={styles.emptyCard}>
          <div style={styles.emptyIcon}>🎯</div>
          <h3>No Savings Goals Active</h3>
          <p style={styles.emptyText}>Start putting money aside for a dream vacation, new gadget, or emergency fund!</p>
          <button className="btn btn-primary" onClick={openAddModal} style={{ marginTop: '1rem' }}>
            Create First Goal
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {goals.map(g => {
            const isCompleted = g.currentAmount >= g.targetAmount;
            const percent = Math.round((g.currentAmount / g.targetAmount) * 100);
            const remaining = Math.max(0, g.targetAmount - g.currentAmount);

            return (
              <div key={g.id} className="glass-card" style={styles.goalCard}>
                <div style={styles.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={18} color="var(--primary)" />
                    <h3 style={styles.cardTitle}>{g.title}</h3>
                  </div>
                  <div style={styles.actions}>
                    <button className="btn-icon" onClick={() => openEditModal(g)} style={{ padding: 4 }}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => handleDelete(g.id)} style={{ color: 'var(--danger)', padding: 4 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={styles.metricsContainer}>
                  <div style={styles.metric}>
                    <span style={styles.metricLabel}>Saved</span>
                    <span style={{ ...styles.metricValue, color: 'var(--success)' }}>
                      ₹{g.currentAmount.toFixed(2)}
                    </span>
                  </div>
                  <div style={styles.metricDivider}></div>
                  <div style={styles.metric}>
                    <span style={styles.metricLabel}>Target</span>
                    <span style={styles.metricValue}>₹{g.targetAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div style={styles.progressBarContainer}>
                  <div style={styles.progressBarBg}>
                    <div style={{ 
                      ...styles.progressBarFill, 
                      width: `${Math.min(percent, 100)}%`,
                      background: isCompleted ? 'var(--success-gradient)' : 'var(--primary-gradient)'
                    }}></div>
                  </div>
                  <div style={styles.progressText}>
                    <span>Target Date: {g.targetDate}</span>
                    <span>{percent}%</span>
                  </div>
                </div>

                <div style={{
                  ...styles.cardFooter,
                  background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'rgba(99, 102, 241, 0.05)',
                  borderColor: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                  color: isCompleted ? '#A7F3D0' : '#C7D2FE'
                }}>
                  {isCompleted ? (
                    <>
                      <CheckCircle size={15} />
                      <span>Completed! Goal achieved.</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp size={15} />
                      <span>Need ₹{remaining.toFixed(2)} more</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={styles.modalHeader}>
              <h3>{formMode === 'ADD' ? 'Configure Savings Goal' : 'Edit Savings Goal'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {formError && <div style={styles.formError}>{formError}</div>}

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Goal Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dream Vacation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div style={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Target Amount (₹)</label>
                  <div style={styles.inputPrefixContainer}>
                    <span style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }}>₹</span>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      style={styles.inputWithPrefix}
                      placeholder="e.g. 5000.00"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Current Saved (₹)</label>
                  <div style={styles.inputPrefixContainer}>
                    <span style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }}>₹</span>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      style={styles.inputWithPrefix}
                      placeholder="e.g. 500.00"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label">Target Date</label>
                <div style={styles.inputPrefixContainer}>
                  <Calendar size={18} style={styles.inputPrefixIcon} />
                  <input
                    type="date"
                    className="form-input"
                    style={styles.inputWithPrefix}
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save Savings Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    background: 'linear-gradient(to right, #fff, #C7D2FE)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  goalCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '230px',
    padding: '1.25rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  metricsContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.25rem',
  },
  metric: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginBottom: '0.25rem',
  },
  metricValue: {
    fontSize: '1.25rem',
    fontWeight: 800,
    fontFamily: 'var(--font-title)',
  },
  metricDivider: {
    width: '1px',
    height: '32px',
    background: 'var(--border-color)',
    margin: '0 1rem',
  },
  progressBarContainer: {
    marginBottom: '1rem',
  },
  progressBarBg: {
    height: '6px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 0.75rem',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  emptyCard: {
    textAlign: 'center',
    padding: '4rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '500px',
    margin: '3rem auto 0',
  },
  emptyIcon: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
  },
  emptyText: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    marginTop: '0.5rem',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.75rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  inputPrefixContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputPrefixIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-muted)',
  },
  inputWithPrefix: {
    paddingLeft: '2.5rem',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1.75rem',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '1rem',
  },
  formError: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#FCA5A5',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    marginBottom: '1rem',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#FCA5A5',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
  },
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255, 255, 255, 0.05)',
    borderTopColor: 'var(--primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

export default SavingsGoals;
