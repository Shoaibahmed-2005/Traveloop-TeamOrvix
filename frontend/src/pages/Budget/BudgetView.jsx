import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { budgetAPI } from '../../api/budgetAPI.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate } from '../../utils/formatDate.js';

const COLORS = ['#1B3A6B','#00B4A6','#F4A340','#EF4444','#10B981','#6C63FF'];
const CATEGORIES = ['transport','hotel','food','activity','shopping','other'];
const CATEGORY_ICONS = { transport:'✈️', hotel:'🏨', food:'🍽️', activity:'🎯', shopping:'🛍️', other:'📌' };

const BudgetView = () => {
  const { id: tripId } = useParams();
  const { user } = useAuth();
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ category:'food', description:'', amount:'', expenseDate: new Date().toISOString().split('T')[0] });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const [bRes, eRes] = await Promise.all([budgetAPI.getBudget(tripId), budgetAPI.getExpenses(tripId)]);
      setBudget(bRes.data.data);
      setExpenses(eRes.data.data);
    } catch { toast.error('Failed to load budget'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [tripId]);

  const addExpense = async (ev) => {
    ev.preventDefault();
    if (!form.description || !form.amount) { toast.error('Description and amount required'); return; }
    setSubmitting(true);
    try {
      await budgetAPI.addExpense(tripId, { category: form.category, description: form.description, amount: parseFloat(form.amount), expenseDate: form.expenseDate });
      toast.success('Expense added!');
      setForm({ category:'food', description:'', amount:'', expenseDate: new Date().toISOString().split('T')[0] });
      load();
    } catch { toast.error('Failed to add expense'); }
    finally { setSubmitting(false); }
  };

  const deleteExpense = async (id) => {
    try { await budgetAPI.deleteExpense(tripId, id); setExpenses(prev => prev.filter(e => e.id !== id)); toast.success('Expense deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="page-container" style={{paddingTop:'var(--space-10)'}}>
    {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{height:80, borderRadius:'var(--radius-lg)', marginBottom:'var(--space-4)'}} />)}
  </div>;

  const pieData = budget?.byCategory?.map(c => ({ name: c.category, value: parseFloat(c.total) })) || [];
  const barData = expenses.reduce((acc, e) => {
    const date = e.expense_date?.split('T')[0] || e.expense_date;
    const existing = acc.find(a => a.date === date);
    if (existing) existing.amount += parseFloat(e.amount);
    else acc.push({ date, amount: parseFloat(e.amount) });
    return acc;
  }, []).sort((a,b) => a.date.localeCompare(b.date));

  return (
    <div className="page-container" style={{paddingTop:'var(--space-8)', paddingBottom:'var(--space-16)'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--space-6)'}}>
        <div>
          <Link to={`/trips/${tripId}`} style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)'}}>← Back to Trip</Link>
          <h1 className="page-title" style={{marginTop:'var(--space-2)'}}>Budget & Expenses</h1>
        </div>
      </div>

      {/* Stats */}
      {budget?.isWarning && (
        <div style={{background: budget.isOverBudget ? 'var(--color-error-bg)' : 'var(--color-warning-bg)', border:`1px solid ${budget.isOverBudget ? 'var(--color-error)' : 'var(--color-warning)'}`, borderRadius:'var(--radius-md)', padding:'var(--space-4)', marginBottom:'var(--space-5)', fontSize:'var(--font-size-base)', fontWeight:'var(--font-weight-medium)', color: budget.isOverBudget ? 'var(--color-error)' : 'var(--color-warning-dark)'}}>
          {budget.isOverBudget ? '🚨 You are over budget!' : `⚠️ ${budget.budgetPct}% of budget used — approaching your limit!`}
        </div>
      )}

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'var(--space-4)', marginBottom:'var(--space-8)'}}>
        {[
          { label:'Total Budget', value: formatCurrency(budget?.totalBudget, user?.country), icon:'💼', color:'var(--color-primary)' },
          { label:'Total Spent', value: formatCurrency(budget?.totalSpent, user?.country), icon:'💸', color:'var(--color-error)' },
          { label:'Remaining', value: formatCurrency(budget?.remaining, user?.country), icon:'💰', color: budget?.remaining >= 0 ? 'var(--color-success)' : 'var(--color-error)' },
          { label:'Avg Per Day', value: formatCurrency(budget?.avgPerDay, user?.country), icon:'📊', color:'var(--color-accent)' },
        ].map((s,i) => (
          <div key={s.label} className="card" style={{padding:'var(--space-5)'}}>
            <div style={{fontSize:24, marginBottom:'var(--space-2)'}}>{s.icon}</div>
            <div style={{fontSize:'var(--font-size-2xl)', fontWeight:'var(--font-weight-extrabold)', color:s.color}}>{s.value}</div>
            <div style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)'}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {expenses.length > 0 && (
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-6)', marginBottom:'var(--space-8)'}}>
          <div className="card" style={{padding:'var(--space-5)'}}>
            <h3 style={{fontWeight:'var(--font-weight-bold)', marginBottom:'var(--space-4)'}}>Spending by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v, user?.country)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{padding:'var(--space-5)'}}>
            <h3 style={{fontWeight:'var(--font-weight-bold)', marginBottom:'var(--space-4)'}}>Daily Spending</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                <XAxis dataKey="date" tick={{fontSize:11}} />
                <YAxis tick={{fontSize:11}} />
                <Tooltip formatter={(v) => formatCurrency(v, user?.country)} />
                <Bar dataKey="amount" fill="var(--color-secondary)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Add Expense Form */}
      <div className="card" style={{padding:'var(--space-5)', marginBottom:'var(--space-6)'}}>
        <h3 style={{fontWeight:'var(--font-weight-bold)', marginBottom:'var(--space-4)'}}>+ Add Expense</h3>
        <form onSubmit={addExpense}>
          <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto auto auto', gap:'var(--space-3)', alignItems:'end'}}>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="input-label">Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm({...form, category:e.target.value})} style={{width:'auto'}}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="input-label">Description *</label>
              <input className="input-field" placeholder="e.g. Hotel booking" value={form.description} onChange={e => setForm({...form, description:e.target.value})} />
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="input-label">Amount ($) *</label>
              <input className="input-field" type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount:e.target.value})} style={{width:100}} />
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="input-label">Date</label>
              <input className="input-field" type="date" value={form.expenseDate} onChange={e => setForm({...form, expenseDate:e.target.value})} style={{width:140}} />
            </div>
            <button type="submit" className="btn-primary" disabled={submitting} style={{whiteSpace:'nowrap', alignSelf:'flex-end'}}>{submitting ? '...' : '+ Add'}</button>
          </div>
        </form>
      </div>

      {/* Expenses Table */}
      <div className="card" style={{overflow:'hidden'}}>
        <div style={{padding:'var(--space-5)', borderBottom:'1px solid var(--color-border-light)'}}>
          <h3 style={{fontWeight:'var(--font-weight-bold)'}}>Expense History ({expenses.length})</h3>
        </div>
        {expenses.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">💳</div><h3 className="empty-state-title">No expenses yet</h3><p className="empty-state-text">Add your first expense above.</p></div>
        ) : (
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'var(--color-surface-2)', borderBottom:'1px solid var(--color-border)'}}>
                {['Date','Category','Description','Amount',''].map(h => <th key={h} style={{padding:'var(--space-3) var(--space-4)', textAlign:'left', fontSize:'var(--font-size-xs)', fontWeight:'var(--font-weight-semibold)', color:'var(--color-text-muted)', textTransform:'uppercase'}}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, i) => (
                <tr key={exp.id} style={{borderBottom:i < expenses.length-1 ? '1px solid var(--color-border-light)' : 'none'}}>
                  <td style={{padding:'var(--space-3) var(--space-4)', fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)'}}>{formatDate(exp.expense_date)}</td>
                  <td style={{padding:'var(--space-3) var(--space-4)'}}><span className="badge" style={{background:'var(--color-surface-2)', color:'var(--color-text-primary)'}}>{CATEGORY_ICONS[exp.category]} {exp.category}</span></td>
                  <td style={{padding:'var(--space-3) var(--space-4)', fontSize:'var(--font-size-sm)'}}>{exp.description}</td>
                  <td style={{padding:'var(--space-3) var(--space-4)', fontWeight:'var(--font-weight-bold)', color:'var(--color-primary)'}}>{formatCurrency(exp.amount, user?.country)}</td>
                  <td style={{padding:'var(--space-3) var(--space-4)'}}><button className="btn-ghost" style={{padding:'4px 8px', color:'var(--color-error)'}} onClick={() => deleteExpense(exp.id)}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BudgetView;
