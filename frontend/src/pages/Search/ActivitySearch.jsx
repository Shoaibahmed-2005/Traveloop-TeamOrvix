import { useState, useEffect } from 'react';
import { activityAPI } from '../../api/activityAPI.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const CATEGORIES = ['sightseeing','food','adventure','culture','shopping','nightlife'];
const CAT_ICONS = { sightseeing:'🏛️', food:'🍜', adventure:'🧗', culture:'🎭', shopping:'🛍️', nightlife:'🌙' };

const ActivitySearch = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [maxCost, setMaxCost] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [selected, setSelected] = useState(null);
  const debouncedSearch = useDebounce(search, 300);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category;
      if (maxCost < 500) params.maxCost = maxCost;
      if (minRating > 0) params.minRating = minRating;
      const { data } = await activityAPI.getActivities(params);
      setActivities(data.data);
    } catch { toast.error('Failed to load activities'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [debouncedSearch, category, maxCost, minRating]);

  return (
    <div style={{paddingBottom:'var(--space-16)'}}>
      <div style={{background:'var(--gradient-brand)', padding:'var(--space-8) 0'}}>
        <div className="page-container">
          <h1 style={{fontSize:'var(--font-size-3xl)', fontWeight:'var(--font-weight-extrabold)', color:'white', marginBottom:'var(--space-4)'}}>🎯 Discover Activities</h1>
          <input className="input-field" placeholder="Search activities..." value={search} onChange={e => setSearch(e.target.value)} style={{maxWidth:500, fontSize:'var(--font-size-lg)'}} />
        </div>
      </div>

      <div className="page-container" style={{paddingTop:'var(--space-6)'}}>
        <div style={{display:'flex', gap:'var(--space-6)', alignItems:'flex-start'}}>
          {/* Filters */}
          <div className="card" style={{width:220, padding:'var(--space-5)', flexShrink:0, position:'sticky', top:80}}>
            <h3 style={{fontWeight:'var(--font-weight-bold)', marginBottom:'var(--space-4)'}}>Filters</h3>
            <div className="form-group">
              <label className="input-label">Category</label>
              <div style={{display:'flex', flexDirection:'column', gap:'var(--space-2)'}}>
                <button className={`badge ${!category ? 'badge-upcoming' : ''}`} style={{cursor:'pointer', border:'1px solid var(--color-border)', justifyContent:'flex-start'}} onClick={() => setCategory('')}>All</button>
                {CATEGORIES.map(c => (
                  <button key={c} className={`badge ${category === c ? 'badge-upcoming' : ''}`} style={{cursor:'pointer', border:'1px solid var(--color-border)', justifyContent:'flex-start'}} onClick={() => setCategory(category === c ? '' : c)}>
                    {CAT_ICONS[c]} {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="input-label">Max Cost: {formatCurrency(maxCost, user?.country)}</label>
              <input type="range" min={0} max={500} step={10} value={maxCost} onChange={e => setMaxCost(Number(e.target.value))} style={{width:'100%', accentColor:'var(--color-secondary)'}} />
            </div>
            <div className="form-group">
              <label className="input-label">Min Rating: ⭐ {minRating}</label>
              <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={e => setMinRating(Number(e.target.value))} style={{width:'100%', accentColor:'var(--color-secondary)'}} />
            </div>
            <button className="btn-ghost" style={{width:'100%'}} onClick={() => { setSearch(''); setCategory(''); setMaxCost(500); setMinRating(0); }}>Reset Filters</button>
          </div>

          {/* Results */}
          <div style={{flex:1}}>
            <p style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)', marginBottom:'var(--space-4)'}}>{activities.length} activities found</p>
            {loading ? (
              <div style={{display:'flex', flexDirection:'column', gap:'var(--space-3)'}}>
                {[...Array(5)].map((_,i) => <div key={i} className="skeleton" style={{height:100, borderRadius:'var(--radius-lg)'}} />)}
              </div>
            ) : activities.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">🎯</div><h3 className="empty-state-title">No activities found</h3><p className="empty-state-text">Try adjusting your filters.</p></div>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:'var(--space-3)'}}>
                {activities.map(act => (
                  <div key={act.id} className="card" style={{padding:'var(--space-4)', cursor:'pointer', display:'flex', gap:'var(--space-4)', alignItems:'flex-start'}} onClick={() => setSelected(act)}>
                    <div style={{width:52, height:52, background:'var(--gradient-brand)', borderRadius:'var(--radius-md)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0}}>
                      {CAT_ICONS[act.category] || '🎯'}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'var(--space-3)'}}>
                        <div>
                          <h3 style={{fontWeight:'var(--font-weight-semibold)', color:'var(--color-text-primary)'}}>{act.name}</h3>
                          <p style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)'}}>{act.city_name}, {act.country}</p>
                        </div>
                        <div style={{display:'flex', gap:'var(--space-2)', flexShrink:0}}>
                          <span className="badge badge-upcoming">{CAT_ICONS[act.category]} {act.category}</span>
                          <span className="badge" style={{background:'var(--color-success-bg)', color:'var(--color-success)'}}>⭐ {act.rating}</span>
                          {act.estimated_cost > 0 ? <span className="badge" style={{background:'var(--color-warning-bg)', color:'var(--color-warning)'}}>{formatCurrency(act.estimated_cost, user?.country)}</span> : <span className="badge" style={{background:'#D1FAE5', color:'#059669'}}>Free</span>}
                        </div>
                      </div>
                      {act.duration_hours && <p style={{fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)', marginTop:4}}>⏱️ {act.duration_hours}h</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{display:'flex', alignItems:'center', gap:'var(--space-3)'}}>
                <span style={{fontSize:28}}>{CAT_ICONS[selected.category] || '🎯'}</span>
                <h3 className="modal-title">{selected.name}</h3>
              </div>
              <button className="btn-ghost" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{color:'var(--color-text-muted)', fontSize:'var(--font-size-sm)', marginBottom:'var(--space-4)'}}>📍 {selected.city_name}, {selected.country}</p>
              {selected.description && <p style={{marginBottom:'var(--space-4)', lineHeight:'var(--line-height-relaxed)'}}>{selected.description}</p>}
              <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-3)'}}>
                {[
                  { icon:'💰', label:'Cost', value: selected.estimated_cost > 0 ? formatCurrency(selected.estimated_cost, user?.country) : 'Free' },
                  { icon:'⏱️', label:'Duration', value: `${selected.duration_hours}h` },
                  { icon:'⭐', label:'Rating', value: `${selected.rating}/5` },
                ].map(s => (
                  <div key={s.label} style={{background:'var(--color-surface-2)', borderRadius:'var(--radius-md)', padding:'var(--space-3)', textAlign:'center'}}>
                    <div style={{fontSize:20, marginBottom:4}}>{s.icon}</div>
                    <div style={{fontWeight:'var(--font-weight-bold)', color:'var(--color-primary)'}}>{s.value}</div>
                    <div style={{fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)'}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySearch;
