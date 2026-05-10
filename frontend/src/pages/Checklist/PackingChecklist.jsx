import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checklistAPI } from '../../api/checklistAPI.js';

const CATEGORIES = ['clothing','documents','electronics','toiletries','medicine','other'];
const CAT_ICONS = { clothing:'👕', documents:'📄', electronics:'🔌', toiletries:'🧴', medicine:'💊', other:'📦' };

const PackingChecklist = () => {
  const { id: tripId } = useParams();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, packed: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [newItem, setNewItem] = useState('');
  const [newCat, setNewCat] = useState('clothing');

  const load = async () => {
    try { const { data } = await checklistAPI.getChecklist(tripId); setItems(data.data); setStats(data.stats); }
    catch { toast.error('Failed to load checklist'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [tripId]);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      const { data } = await checklistAPI.addItem(tripId, { itemName: newItem.trim(), category: newCat });
      setItems(prev => [...prev, data.data]);
      setStats(prev => ({ ...prev, total: prev.total + 1 }));
      setNewItem('');
      toast.success('Item added ✅');
    } catch { toast.error('Failed to add item'); }
  };

  const toggleItem = async (id) => {
    try {
      const { data } = await checklistAPI.toggleItem(tripId, id);
      setItems(prev => prev.map(i => i.id === id ? data.data : i));
      const updatedItems = items.map(i => i.id === id ? data.data : i);
      setStats({ total: updatedItems.length, packed: updatedItems.filter(i => i.is_packed).length });
    } catch { toast.error('Failed to toggle item'); }
  };

  const deleteItem = async (id) => {
    try {
      await checklistAPI.deleteItem(tripId, id);
      const updated = items.filter(i => i.id !== id);
      setItems(updated);
      setStats({ total: updated.length, packed: updated.filter(i => i.is_packed).length });
    } catch { toast.error('Failed to delete item'); }
  };

  const resetAll = async () => {
    if (!confirm('Reset all items to unpacked?')) return;
    try {
      await checklistAPI.resetChecklist(tripId);
      setItems(prev => prev.map(i => ({ ...i, is_packed: false })));
      setStats(prev => ({ ...prev, packed: 0 }));
      toast.success('Checklist reset!');
    } catch { toast.error('Failed to reset'); }
  };

  const filtered = activeTab === 'all' ? items : items.filter(i => i.category === activeTab);
  const pct = stats.total > 0 ? Math.round((stats.packed / stats.total) * 100) : 0;

  return (
    <div className="page-container" style={{paddingTop:'var(--space-8)', paddingBottom:'var(--space-16)'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--space-6)'}}>
        <div>
          <Link to={`/trips/${tripId}`} style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)'}}>← Back to Trip</Link>
          <h1 className="page-title" style={{marginTop:'var(--space-2)'}}>Packing Checklist</h1>
        </div>
        <div style={{display:'flex', gap:'var(--space-2)'}}>
          <button className="btn-ghost" onClick={() => window.print()}>🖨️ Print</button>
          <button className="btn-ghost" onClick={resetAll} style={{color:'var(--color-error)'}}>↺ Reset All</button>
        </div>
      </div>

      {/* Progress */}
      <div className="card" style={{padding:'var(--space-5)', marginBottom:'var(--space-6)'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--space-3)'}}>
          <span style={{fontWeight:'var(--font-weight-semibold)'}}>📦 {stats.packed} of {stats.total} items packed</span>
          <span style={{fontWeight:'var(--font-weight-bold)', color: pct === 100 ? 'var(--color-success)' : 'var(--color-text-muted)'}}>{pct}%{pct === 100 ? ' 🎉' : ''}</span>
        </div>
        <div className="progress-bar" style={{height:12}}>
          <div className="progress-fill" style={{width:`${pct}%`, background: pct === 100 ? 'var(--color-success)' : 'var(--gradient-brand)'}} />
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{display:'flex', gap:'var(--space-2)', flexWrap:'wrap', marginBottom:'var(--space-5)'}}>
        <button className={`badge ${activeTab === 'all' ? 'badge-upcoming' : ''}`} style={{cursor:'pointer', border:'1px solid var(--color-border)'}} onClick={() => setActiveTab('all')}>All ({items.length})</button>
        {CATEGORIES.map(cat => (
          <button key={cat} className={`badge ${activeTab === cat ? 'badge-upcoming' : ''}`} style={{cursor:'pointer', border:'1px solid var(--color-border)'}} onClick={() => setActiveTab(cat)}>
            {CAT_ICONS[cat]} {cat} ({items.filter(i => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Add Item */}
      <form onSubmit={addItem} style={{display:'flex', gap:'var(--space-3)', marginBottom:'var(--space-5)'}}>
        <select className="input-field" value={newCat} onChange={e => setNewCat(e.target.value)} style={{width:'auto'}}>
          {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
        </select>
        <input className="input-field" placeholder="Add new item..." value={newItem} onChange={e => setNewItem(e.target.value)} style={{flex:1}} />
        <button type="submit" className="btn-primary">+ Add</button>
      </form>

      {/* Items */}
      {loading ? [...Array(5)].map((_,i) => <div key={i} className="skeleton" style={{height:52, borderRadius:'var(--radius-md)', marginBottom:'var(--space-2)'}} />) :
        filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">{CAT_ICONS[activeTab] || '📦'}</div><h3 className="empty-state-title">No items in {activeTab}</h3></div>
        ) : (
          <div className="card" style={{overflow:'hidden'}}>
            {filtered.map((item, i) => (
              <div key={item.id} style={{display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-4) var(--space-5)', borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border-light)' : 'none', transition:'background var(--transition-fast)', background: item.is_packed ? 'var(--color-success-bg)' : 'transparent'}}>
                <input type="checkbox" checked={item.is_packed} onChange={() => toggleItem(item.id)} style={{width:18, height:18, cursor:'pointer', accentColor:'var(--color-secondary)'}} />
                <span style={{fontSize:16}}>{CAT_ICONS[item.category]}</span>
                <span style={{flex:1, fontSize:'var(--font-size-base)', color: item.is_packed ? 'var(--color-text-muted)' : 'var(--color-text-primary)', textDecoration: item.is_packed ? 'line-through' : 'none'}}>{item.item_name}</span>
                <span className="badge" style={{background:'var(--color-surface-2)', color:'var(--color-text-muted)'}}>{item.category}</span>
                <button className="btn-ghost" style={{padding:'4px 8px', color:'var(--color-error)'}} onClick={() => deleteItem(item.id)}>✕</button>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
};

export default PackingChecklist;
