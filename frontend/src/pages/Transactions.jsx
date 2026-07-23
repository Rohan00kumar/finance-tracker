import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Download,
  Filter,
  X,
  FileSpreadsheet,
  FileText
} from 'lucide-react';

const CATEGORIES = [
  'Salary', 'Freelance', 'Investments', 
  'Food & Dining', 'Rent & Housing', 'Utilities', 
  'Transportation', 'Entertainment', 'Shopping', 'Healthcare', 'Other'
];

const Transactions = ({ showToast }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('ADD'); // ADD or EDIT
  const [editingId, setEditingId] = useState(null);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [category, setCategory] = useState(CATEGORIES[3]); // Default to Food & Dining
  const [formError, setFormError] = useState('');

  // Export state
  const [exportStart, setExportStart] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().substring(0, 10)
  );
  const [exportEnd, setExportEnd] = useState(
    new Date().toISOString().substring(0, 10)
  );

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const openAddModal = () => {
    setFormMode('ADD');
    setEditingId(null);
    setDescription('');
    setAmount('');
    setType('EXPENSE');
    setDate(new Date().toISOString().substring(0, 10));
    setCategory(CATEGORIES[3]);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (tx) => {
    setFormMode('EDIT');
    setEditingId(tx.id);
    setDescription(tx.description);
    setAmount(tx.amount.toString());
    setType(tx.type);
    setDate(tx.date);
    setCategory(tx.category);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!description || !amount || !date || !category) {
      setFormError('All fields are required');
      return;
    }

    const payload = {
      description,
      amount: parseFloat(amount),
      type,
      date,
      category
    };

    try {
      if (formMode === 'ADD') {
        await api.post('/transactions', payload);
        if (showToast) showToast('Transaction logged successfully!', 'success');
      } else {
        await api.put(`/transactions/${editingId}`, payload);
        if (showToast) showToast('Transaction updated successfully!', 'success');
      }
      fetchTransactions();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to save transaction');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
      if (showToast) showToast('Transaction deleted successfully', 'info');
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to delete transaction', 'error');
    }
  };

  // Export report helpers
  const handleExport = async (format) => {
    try {
      const response = await api.get(`/reports/${format}?startDate=${exportStart}&endDate=${exportEnd}`, {
        responseType: 'blob', // Important to handle binaries
      });
      
      // Create element link to trigger direct browser download
      const blob = new Blob([response.data], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `finance_report_${exportStart}_to_${exportEnd}.${format}`;
      link.click();
      if (showToast) showToast(`Finance report exported as ${format.toUpperCase()}!`, 'success');
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to download report', 'error');
    }
  };

  // Filter logic
  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
                          t.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading Transactions...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Transactions Log</h1>
          <p style={styles.subtitle}>Add, review, and modify your financial operations</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          New Transaction
        </button>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      {/* Export Reports Box */}
      <section className="glass-card" style={styles.exportCard}>
        <h3 style={styles.exportTitle}>Download Period Reports</h3>
        <div style={styles.exportControls}>
          <div style={styles.exportFormGroup}>
            <label style={styles.exportLabel}>Start Date</label>
            <input 
              type="date" 
              value={exportStart} 
              onChange={(e) => setExportStart(e.target.value)} 
              style={styles.exportInput}
            />
          </div>
          <div style={styles.exportFormGroup}>
            <label style={styles.exportLabel}>End Date</label>
            <input 
              type="date" 
              value={exportEnd} 
              onChange={(e) => setExportEnd(e.target.value)} 
              style={styles.exportInput}
            />
          </div>
          <div style={styles.exportButtons}>
            <button className="btn btn-secondary" onClick={() => handleExport('pdf')} style={styles.exportBtn}>
              <FileText size={16} color="#F87171" />
              Export PDF
            </button>
            <button className="btn btn-secondary" onClick={() => handleExport('csv')} style={styles.exportBtn}>
              <FileSpreadsheet size={16} color="#34D399" />
              Export CSV
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="glass-card" style={styles.filterBar}>
        <div style={styles.searchBox}>
          <Search size={18} color="var(--text-muted)" style={styles.searchIcon} />
          <input
            type="text"
            className="form-input"
            style={styles.searchInput}
            placeholder="Search description or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={styles.dropdowns}>
          <div style={styles.filterSelectContainer}>
            <Filter size={14} color="var(--text-muted)" />
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              style={styles.select}
            >
              <option value="ALL">All Types</option>
              <option value="INCOME">Income Only</option>
              <option value="EXPENSE">Expense Only</option>
            </select>
          </div>

          <div style={styles.filterSelectContainer}>
            <Filter size={14} color="var(--text-muted)" />
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={styles.select}
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Transactions Table */}
      <div className="glass-card" style={styles.tableCard}>
        {filtered.length === 0 ? (
          <div style={styles.noTransactions}>No operations match your filters.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Type</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id} style={styles.tr}>
                    <td style={styles.td}>{tx.date}</td>
                    <td style={styles.td}>
                      <span style={styles.categoryBadge}>{tx.category}</span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: 500 }}>{tx.description}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.typeBadge,
                        background: tx.type === 'INCOME' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: tx.type === 'INCOME' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ 
                      ...styles.td, 
                      fontWeight: 750, 
                      textAlign: 'right',
                      color: tx.type === 'INCOME' ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <div style={styles.actionsCell}>
                        <button className="btn-icon" onClick={() => openEditModal(tx)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon" onClick={() => handleDelete(tx.id)} style={{ color: 'var(--danger)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog (Add & Edit) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={styles.modalHeader}>
              <h3>{formMode === 'ADD' ? 'Record Operation' : 'Edit Operation'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {formError && <div style={styles.formError}>{formError}</div>}

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Weekly Grocery Run"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="25.50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select 
                    className="form-input"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
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
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {formMode === 'ADD' ? 'Save Transaction' : 'Update Details'}
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
  exportCard: {
    marginBottom: '1.5rem',
    padding: '1.25rem 1.5rem',
  },
  exportTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    marginBottom: '0.75rem',
  },
  exportControls: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: '1.25rem',
  },
  exportFormGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    flex: '1 1 180px',
  },
  exportLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 600,
  },
  exportInput: {
    background: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '0.5rem 0.75rem',
    color: '#fff',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    colorScheme: 'dark',
    width: '100%',
  },
  exportButtons: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  exportBtn: {
    padding: '0.5rem 1rem',
    height: '38px',
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem',
    padding: '1rem',
  },
  searchBox: {
    position: 'relative',
    flex: '1 1 280px',
    minWidth: '240px',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  searchInput: {
    paddingLeft: '2.75rem',
  },
  dropdowns: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  filterSelectContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(17, 24, 39, 0.8)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '0.25rem 0.75rem',
  },
  select: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    padding: '0.5rem 0',
    cursor: 'pointer',
    fontWeight: 500,
    colorScheme: 'dark',
  },
  tableCard: {
    padding: 0,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    minWidth: '600px',
  },
  th: {
    padding: '1rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 600,
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background var(--transition-fast)',
  },
  td: {
    padding: '1rem 1.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
  },
  categoryBadge: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '0.25rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    color: '#E0E7FF',
  },
  typeBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  actionsCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  noTransactions: {
    padding: '3rem',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
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

export default Transactions;
