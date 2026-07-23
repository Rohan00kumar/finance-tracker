import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#3B82F6', '#14B8A6'];

const Dashboard = ({ showToast, setActivePage }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().substring(0, 7) // YYYY-MM
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [txRes, budgetRes, savingsRes] = await Promise.all([
        api.get('/transactions'),
        api.get(`/budgets?monthYear=${selectedMonth}`),
        api.get('/savings')
      ]);
      setTransactions(txRes.data);
      setBudgets(budgetRes.data);
      setSavingsGoals(savingsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  // Filter transactions for the selected month
  const filteredTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));

  // Compute metrics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const totalSavings = savingsGoals.reduce((sum, g) => sum + (g.currentAmount || 0), 0);

  // Chart 1: Income vs Expense
  const barChartData = [
    { name: 'Income', Amount: totalIncome, fill: '#10B981' },
    { name: 'Expenses', Amount: totalExpense, fill: '#EF4444' }
  ];

  // Chart 2: Expense Category Breakdown
  const categoryDataMap = {};
  filteredTransactions
    .filter(t => t.type === 'EXPENSE')
    .forEach(t => {
      const cat = t.category;
      categoryDataMap[cat] = (categoryDataMap[cat] || 0) + t.amount;
    });

  const pieChartData = Object.keys(categoryDataMap).map(key => ({
    name: key,
    value: categoryDataMap[key]
  }));

  // Budget Alerts (Over Budget)
  const budgetAlerts = budgets.filter(b => b.spentAmount > b.limitAmount);

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header with Month Filter */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Financial Dashboard</h1>
          <p style={styles.subtitle}>Real-time overview of your incomes, expenses, budgets & savings</p>
        </div>
        
        <div style={styles.filterContainer}>
          <Calendar size={18} color="var(--text-secondary)" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={styles.monthInput}
          />
        </div>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      {/* KPI Cards */}
      <section style={styles.kpiGrid}>
        <div 
          className="glass-card" 
          style={{ ...styles.kpiCard, cursor: setActivePage ? 'pointer' : 'default' }}
          onClick={() => setActivePage && setActivePage('transactions')}
        >
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>Current Balance</span>
            <div style={{ ...styles.kpiIcon, background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
              <Wallet size={20} />
            </div>
          </div>
          <h2 style={{ ...styles.kpiValue, color: netBalance >= 0 ? '#fff' : 'var(--danger)' }}>
            ₹{netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <span style={styles.kpiFootnote}>Income minus Expenses</span>
        </div>

        <div 
          className="glass-card" 
          style={{ ...styles.kpiCard, cursor: setActivePage ? 'pointer' : 'default' }}
          onClick={() => setActivePage && setActivePage('transactions')}
        >
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>Total Income</span>
            <div style={{ ...styles.kpiIcon, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <h2 style={{ ...styles.kpiValue, color: 'var(--success)' }}>
            +₹{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <span style={styles.kpiFootnote}>Total earnings in period</span>
        </div>

        <div 
          className="glass-card" 
          style={{ ...styles.kpiCard, cursor: setActivePage ? 'pointer' : 'default' }}
          onClick={() => setActivePage && setActivePage('transactions')}
        >
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>Total Expenses</span>
            <div style={{ ...styles.kpiIcon, background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
              <TrendingDown size={20} />
            </div>
          </div>
          <h2 style={{ ...styles.kpiValue, color: 'var(--danger)' }}>
            -₹{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <span style={styles.kpiFootnote}>Total spending in period</span>
        </div>

        <div 
          className="glass-card" 
          style={{ ...styles.kpiCard, cursor: setActivePage ? 'pointer' : 'default' }}
          onClick={() => setActivePage && setActivePage('savings')}
        >
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>Total Savings</span>
            <div style={{ ...styles.kpiIcon, background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA' }}>
              <Target size={20} />
            </div>
          </div>
          <h2 style={{ ...styles.kpiValue, color: '#C7D2FE' }}>
            ₹{totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <span style={styles.kpiFootnote}>Saved across {savingsGoals.length} active goals</span>
        </div>
      </section>

      {/* Visual Analytics */}
      <section style={styles.chartsGrid}>
        <div className="glass-card" style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Summary Comparison</h3>
          <div style={styles.chartWrapper}>
            {totalIncome === 0 && totalExpense === 0 ? (
              <div style={styles.emptyChart}>No transactions recorded for this month</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} barSize={60}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff', fontWeight: 600 }}
                  />
                  <Bar dataKey="Amount">
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-card" style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Expense Breakdown</h3>
          <div style={styles.chartWrapper}>
            {pieChartData.length === 0 ? (
              <div style={styles.emptyChart}>No expenses recorded for this month</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ color: 'var(--text-secondary)', fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      {/* Warnings and Alerts */}
      <section style={styles.alertsAndLogGrid}>
        {/* Budget Exceeded Alerts */}
        <div className="glass-card" style={styles.alertCard}>
          <h3 style={styles.chartTitle}>Budget Alerts</h3>
          <div style={styles.alertsList}>
            {budgetAlerts.length === 0 ? (
              <div style={styles.allBudgetsOk}>
                <span style={styles.okIcon}>✓</span>
                All category budgets are within limits. Great job!
              </div>
            ) : (
              budgetAlerts.map(alert => {
                const percent = Math.round((alert.spentAmount / alert.limitAmount) * 100);
                return (
                  <div key={alert.id} style={styles.alertItem}>
                    <div style={styles.alertItemHeader}>
                      <div style={styles.alertCategory}>
                        <AlertTriangle size={16} color="var(--warning)" style={{ marginRight: '0.5rem' }} />
                        <span>{alert.category}</span>
                      </div>
                      <span style={styles.alertBadge}>Over Budget</span>
                    </div>
                    
                    <div style={styles.progressBarBg}>
                      <div style={{ ...styles.progressBarFill, width: `${Math.min(percent, 100)}%` }}></div>
                    </div>
                    
                    <div style={styles.alertAmounts}>
                      <span>Spent: <b>₹{alert.spentAmount}</b></span>
                      <span>Limit: <b>₹{alert.limitAmount}</b></span>
                      <span style={{ color: 'var(--danger)' }}>({percent}% used)</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Transactions Mini List */}
        <div className="glass-card" style={styles.alertCard}>
          <h3 style={styles.chartTitle}>Recent Operations</h3>
          <div style={styles.recentTxList}>
            {filteredTransactions.length === 0 ? (
              <div style={styles.noTx}>No transactions recorded this month.</div>
            ) : (
              filteredTransactions.slice(0, 5).map(tx => (
                <div key={tx.id} style={styles.txRow}>
                  <div style={styles.txIconContainer}>
                    <ArrowRightLeft size={16} color="var(--text-secondary)" />
                  </div>
                  <div style={styles.txDetails}>
                    <span style={styles.txDesc}>{tx.description}</span>
                    <span style={styles.txSub}>{tx.category} • {tx.date}</span>
                  </div>
                  <span style={{ 
                    ...styles.txAmt, 
                    color: tx.type === 'INCOME' ? 'var(--success)' : 'var(--danger)' 
                  }}>
                    {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
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
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#FCA5A5',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  kpiCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  kpiHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  kpiIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
  },
  kpiValue: {
    fontSize: '2rem',
    fontWeight: 800,
    fontFamily: 'var(--font-title)',
  },
  kpiFootnote: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  chartCard: {
    minHeight: '350px',
    display: 'flex',
    flexDirection: 'column',
  },
  chartTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: 'var(--text-primary)',
  },
  chartWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '260px',
  },
  emptyChart: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  alertsAndLogGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  alertCard: {
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
  },
  alertsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    flex: 1,
    justifyContent: 'flex-start',
  },
  allBudgetsOk: {
    background: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.1)',
    color: '#34D399',
    padding: '1.25rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontWeight: 500,
  },
  okIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'var(--success)',
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  alertItem: {
    background: 'rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    padding: '1rem',
  },
  alertItemHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  alertCategory: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    fontSize: '0.95rem',
    textTransform: 'capitalize',
  },
  alertBadge: {
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#FCA5A5',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  progressBarBg: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
    marginBottom: '0.5rem',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: 'var(--danger-gradient)',
    borderRadius: '3px',
  },
  alertAmounts: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  recentTxList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  txRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem',
    background: 'rgba(0, 0, 0, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.02)',
    borderRadius: '8px',
    transition: 'all 0.15s ease',
  },
  txIconContainer: {
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '0.5rem',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
  },
  txDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  txDesc: {
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  txSub: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  txAmt: {
    fontSize: '0.95rem',
    fontWeight: 700,
    fontFamily: 'var(--font-title)',
  },
  noTx: {
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
    textAlign: 'center',
    padding: '2rem 0',
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

export default Dashboard;
