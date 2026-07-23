import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, 
  Trash2, 
  Edit2,
  X, 
  AlertTriangle, 
  Calendar, 
  CheckCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const CATEGORIES = [
  'Food & Dining', 'Rent & Housing', 'Utilities', 
  'Transportation', 'Entertainment', 'Shopping', 'Healthcare', 'Other'
];

const Budgets = ({ showToast }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().substring(0, 7) // YYYY-MM
  );

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('ADD'); // 'ADD' or 'EDIT'
  const [editingId, setEditingId] = useState(null);
  const [editingCategory, setEditingCategory] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [limitAmount, setLimitAmount] = useState('');
  const [spentAmount, setSpentAmount] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/budgets?monthYear=${selectedMonth}`);
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

  const openAddModal = () => {
    setFormMode('ADD');
    setEditingId(null);
    setEditingCategory('');
    setCategory(CATEGORIES[0]);
    setLimitAmount('');
    setSpentAmount('0');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (budget) => {
    setFormMode('EDIT');
    setEditingId(budget.id);
    setEditingCategory(budget.category);
    setCategory(budget.category);
    setLimitAmount(budget.limitAmount.toString());
    setSpentAmount(budget.spentAmount.toString());
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!limitAmount || parseFloat(limitAmount) <= 0) {
      setFormError('Please enter a valid limit amount greater than zero');
      return;
    }

    if (spentAmount === '' || isNaN(parseFloat(spentAmount)) || parseFloat(spentAmount) < 0) {
      setFormError('Please enter a valid spent amount (0 or positive)');
      return;
    }

    setFormLoading(true);
    try {
      // If editing and category changed, delete old budget entry first
      if (formMode === 'EDIT' && editingCategory && editingCategory !== category && editingId) {
        try {
          await api.delete(`/budgets/${editingId}`);
        } catch (delErr) {
          console.warn('Could not remove previous category budget:', delErr);
        }
      }

      const payload = {
        category,
        limitAmount: parseFloat(limitAmount),
        spentAmount: parseFloat(spentAmount),
        monthYear: selectedMonth
      };
      
      const res = await api.post('/budgets', payload);
      
      // Update local state instantly with returned response
      setBudgets(prev => {
        const filtered = prev.filter(b => b.category.toLowerCase() !== category.toLowerCase());
        return [...filtered, res.data];
      });

      await fetchBudgets();
      setIsModalOpen(false);

      if (showToast) {
        showToast(
          formMode === 'ADD' 
            ? `Budget for ${category} set successfully!` 
            : `Budget details for ${category} updated successfully!`, 
          'success'
        );
      }
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to save budget limit');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget limit?')) return;
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgets();
      if (showToast) {
        showToast('Budget deleted successfully', 'info');
      }
    } catch (err) {
      console.error(err);
      if (showToast) {
        showToast('Failed to delete budget limit', 'error');
      } else {
        alert('Failed to delete budget limit');
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading Budgets...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Monthly Budgets</h1>
          <p style={styles.subtitle}>Set targets, monitor spending, and easily adjust category limits</p>
        </div>
        
        <div style={styles.actions}>
          <div style={styles.filterContainer}>
            <Calendar size={16} color="var(--text-secondary)" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={styles.monthInput}
            />
          </div>
          
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} />
            Set Budget Limit
          </button>
        </div>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <div className="glass-card" style={styles.emptyCard}>
          <div style={styles.emptyIcon}>🎯</div>
          <h3>No Budgets Set</h3>
          <p style={styles.emptyText}>You haven't set any category budgets for this month. Create one to start tracking your spending limits!</p>
          <button className="btn btn-primary" onClick={openAddModal} style={{ marginTop: '1rem' }}>
            Create First Budget
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {budgets.map(b => {
            const isOver = b.spentAmount > b.limitAmount;
            const percent = Math.min(100, Math.round((b.spentAmount / b.limitAmount) * 100));
            const rawPercent = Math.round((b.spentAmount / b.limitAmount) * 100);
            const remaining = b.limitAmount - b.spentAmount;
            const isNearLimit = !isOver && percent >= 80;

            let footerBg = 'rgba(16, 185, 129, 0.08)';
            let footerBorder = 'rgba(16, 185, 129, 0.2)';
            let footerColor = '#A7F3D0';
            let barBg = 'var(--success-gradient)';

            if (isOver) {
              footerBg = 'rgba(239, 68, 68, 0.08)';
              footerBorder = 'rgba(239, 68, 68, 0.2)';
              footerColor = '#FCA5A5';
              barBg = 'var(--danger-gradient)';
            } else if (isNearLimit) {
              footerBg = 'rgba(245, 158, 11, 0.08)';
              footerBorder = 'rgba(245, 158, 11, 0.2)';
              footerColor = '#FDE68A';
              barBg = 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
            }

            return (
              <div key={b.id} className="glass-card" style={styles.budgetCard}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{b.category}</h3>
                  <div style={styles.cardHeaderActions}>
                    <button 
                      className="btn-icon" 
                      onClick={() => openEditModal(b)} 
                      title="Edit Budget Details"
                      style={{ padding: 6, color: '#A5B4FC' }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => handleDelete(b.id)} 
                      title="Delete Budget"
                      style={{ color: 'var(--danger)', padding: 6 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={styles.metricsContainer}>
                  <div style={styles.metric}>
                    <span style={styles.metricLabel}>Spent</span>
                    <span style={{ ...styles.metricValue, color: isOver ? 'var(--danger)' : '#fff' }}>
                      ₹{b.spentAmount.toFixed(2)}
                    </span>
                  </div>
                  <div style={styles.metricDivider}></div>
                  <div style={styles.metric}>
                    <span style={styles.metricLabel}>Budget Limit</span>
                    <span style={styles.metricValue}>₹{b.limitAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div style={styles.progressBarContainer}>
                  <div style={styles.progressBarBg}>
                    <div style={{ 
                      ...styles.progressBarFill, 
                      width: `${percent}%`,
                      background: barBg
                    }}></div>
                  </div>
                  <div style={styles.progressPercent}>{rawPercent}% used</div>
                </div>

                {/* Status footer */}
                <div style={{
                  ...styles.cardFooter,
                  background: footerBg,
                  borderColor: footerBorder,
                  color: footerColor
                }}>
                  {isOver ? (
                    <>
                      <AlertTriangle size={16} />
                      <span>Exceeded by ₹{Math.abs(remaining).toFixed(2)}!</span>
                    </>
                  ) : isNearLimit ? (
                    <>
                      <AlertTriangle size={16} />
                      <span>Warning: Only ₹{remaining.toFixed(2)} left</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>₹{remaining.toFixed(2)} remaining</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Update Budget Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={styles.modalHeader}>
              <h3>{formMode === 'ADD' ? 'Set Category Budget' : 'Edit Budget Details'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {formError && <div style={styles.formError}>{formError}</div>}

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Budget Limit Amount (₹)</label>
                  <div style={styles.inputPrefixContainer}>
                    <span style={styles.prefixSymbol}>₹</span>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      style={styles.inputWithPrefix}
                      placeholder="e.g. 5000.00"
                      value={limitAmount}
                      onChange={(e) => setLimitAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Spent Amount (₹)</label>
                  <div style={styles.inputPrefixContainer}>
                    <span style={styles.prefixSymbol}>₹</span>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      style={styles.inputWithPrefix}
                      placeholder="e.g. 1200.00"
                      value={spentAmount}
                      onChange={(e) => setSpentAmount(e.target.value)}
                    />
                  </div>
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
                  {formLoading ? 'Saving...' : formMode === 'ADD' ? 'Set Budget Limit' : 'Save Changes'}
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
    padding: '1.5rem 2rem',
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
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '0.5rem 1rem',
  },
  monthInput: {
    border: 'none',
    background: 'transparent',
    color: '#fff',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
    colorScheme: 'dark',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
    gap: '1.5rem',
  },
  budgetCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '220px',
    padding: '1.25rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  cardHeaderActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    textTransform: 'capitalize',
    color: '#fff',
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
    fontWeight: 600,
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
    height: '8px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '0.35rem',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  progressPercent: {
    fontSize: '0.75rem',
    textAlign: 'right',
    color: 'var(--text-secondary)',
    fontWeight: 600,
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 0.875rem',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '0.825rem',
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
  inputPrefixContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  prefixSymbol: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
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

export default Budgets;
