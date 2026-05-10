import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cityAPI } from '../../api/cityAPI.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const REGIONS = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];
const COST_COLORS = { cheap: '#10B981', medium: '#F59E0B', expensive: '#EF4444' };
const getCostLabel = (idx) => {
  if (idx < 1) return { label: '$', color: '#10B981', text: 'Budget' };
  if (idx < 2) return { label: '$$', color: '#F59E0B', text: 'Moderate' };
  return { label: '$$$', color: '#EF4444', text: 'Expensive' };
};

const CitySearch = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState('');
  const [sort, setSort] = useState('popularity');
  const [selectedCity, setSelectedCity] = useState(null);
  const debouncedSearch = useDebounce(search, 300);

  const loadCities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (activeRegion) params.region = activeRegion;
      if (sort !== 'popularity') params.sort = sort;
      const { data } = await cityAPI.getCities(params);
      setCities(data.data);
    } catch { toast.error('Failed to load cities'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    cityAPI.getRegions().then(r => setRegions(r.data.data));
  }, []);

  useEffect(() => { loadCities(); }, [debouncedSearch, activeRegion, sort]);

  const GRADIENTS = ['linear-gradient(135deg,#1B3A6B,#00B4A6)','linear-gradient(135deg,#F4A340,#1B3A6B)','linear-gradient(135deg,#6C63FF,#00B4A6)','linear-gradient(135deg,#10B981,#1B3A6B)','linear-gradient(135deg,#EF4444,#F4A340)'];

  return (
    <div style={{paddingBottom:'var(--space-16)'}}>
      <div style={{background:'var(--gradient-hero)', padding:'var(--space-10) 0'}}>
        <div className="page-container">
          <h1 style={{fontSize:'var(--font-size-4xl)', fontWeight:'var(--font-weight-extrabold)', color:'white', marginBottom:'var(--space-4)'}}>🌍 Explore Destinations</h1>
          <div style={{position:'relative', maxWidth:600}}>
            <input className="input-field" placeholder="Search cities, countries..." value={search} onChange={e => setSearch(e.target.value)} style={{paddingLeft:44, fontSize:'var(--font-size-lg)', height:52, borderRadius:'var(--radius-xl)'}} />
            <span style={{position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:20}}>🔍</span>
          </div>
        </div>
      </div>

      <div className="page-container" style={{paddingTop:'var(--space-6)'}}>
        <div style={{display:'flex', gap:'var(--space-3)', alignItems:'center', marginBottom:'var(--space-6)', flexWrap:'wrap'}}>
          <div style={{display:'flex', gap:'var(--space-2)', flexWrap:'wrap', flex:1}}>
            <button className={`badge ${!activeRegion ? 'badge-upcoming' : ''}`} style={{cursor:'pointer', border:'1px solid var(--color-border)', padding:'6px 14px'}} onClick={() => setActiveRegion('')}>All Regions</button>
            {regions.map(r => (
              <button key={r} className={`badge ${activeRegion === r ? 'badge-upcoming' : ''}`} style={{cursor:'pointer', border:'1px solid var(--color-border)', padding:'6px 14px'}} onClick={() => setActiveRegion(activeRegion === r ? '' : r)}>{r}</button>
            ))}
          </div>
          <select className="input-field" value={sort} onChange={e => setSort(e.target.value)} style={{width:'auto'}}>
            <option value="popularity">Most Popular</option>
            <option value="cost_asc">Cheapest First</option>
            <option value="cost_desc">Expensive First</option>
          </select>
        </div>

        <div style={{display:'flex', gap:'var(--space-6)', alignItems:'flex-start'}}>
          <div style={{flex:1}}>
            <p style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)', marginBottom:'var(--space-4)'}}>{cities.length} destinations found</p>
            {loading ? (
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'var(--space-4)'}}>
                {[...Array(9)].map((_,i) => <div key={i} className="skeleton" style={{height:240, borderRadius:'var(--radius-lg)'}} />)}
              </div>
            ) : cities.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">🗺️</div><h3 className="empty-state-title">No cities found</h3><p className="empty-state-text">Try a different search or region filter.</p></div>
            ) : (
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'var(--space-4)'}}>
                {cities.map((city, i) => {
                  const cost = getCostLabel(city.cost_index);
                  return (
                    <div key={city.id} className="card" style={{cursor:'pointer', overflow:'hidden'}} onClick={() => setSelectedCity(city)}>
                      <div style={{height:160, background:GRADIENTS[i % GRADIENTS.length], position:'relative', display:'flex', alignItems:'flex-end', padding:'var(--space-3)'}}>
                        <div style={{display:'flex', gap:'var(--space-2)', alignItems:'center'}}>
                          <span className="badge" style={{background:'rgba(0,0,0,0.3)', color:'white', backdropFilter:'blur(4px)'}}>{city.region}</span>
                          <span className="badge" style={{background:'rgba(0,0,0,0.3)', color:cost.color, backdropFilter:'blur(4px)'}}>{cost.label}</span>
                        </div>
                      </div>
                      <div style={{padding:'var(--space-4)'}}>
                        <div style={{fontWeight:'var(--font-weight-bold)', fontSize:'var(--font-size-lg)', color:'var(--color-text-primary)'}}>{city.name}</div>
                        <div style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)', marginBottom:'var(--space-2)'}}>{city.country}</div>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                          <span style={{fontSize:'var(--font-size-xs)', color:cost.color, fontWeight:'var(--font-weight-semibold)'}}>{cost.text}</span>
                          <span style={{fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)'}}>⭐ {city.popularity_score}/100</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* City Detail Panel */}
          {selectedCity && (
            <div className="card" style={{width:300, flexShrink:0, overflow:'hidden', position:'sticky', top:80}}>
              <div style={{height:160, background:'var(--gradient-brand)', display:'flex', alignItems:'flex-end', padding:'var(--space-3)'}}>
                <div>
                  <h3 style={{color:'white', fontWeight:'var(--font-weight-extrabold)', fontSize:'var(--font-size-xl)'}}>{selectedCity.name}</h3>
                  <p style={{color:'rgba(255,255,255,0.8)', fontSize:'var(--font-size-sm)'}}>{selectedCity.country} · {selectedCity.region}</p>
                </div>
              </div>
              <div style={{padding:'var(--space-4)'}}>
                <button style={{position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.3)', border:'none', color:'white', cursor:'pointer', borderRadius:'50%', width:28, height:28}} onClick={() => setSelectedCity(null)}>✕</button>
                {selectedCity.description && <p style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)', marginBottom:'var(--space-4)', lineHeight:'var(--line-height-relaxed)'}}>{selectedCity.description}</p>}
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'var(--space-3)', fontSize:'var(--font-size-sm)'}}>
                  <span style={{color:'var(--color-text-muted)'}}>Cost Index</span>
                  <span style={{fontWeight:'var(--font-weight-semibold)', color:getCostLabel(selectedCity.cost_index).color}}>{getCostLabel(selectedCity.cost_index).label} — {getCostLabel(selectedCity.cost_index).text}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'var(--space-4)', fontSize:'var(--font-size-sm)'}}>
                  <span style={{color:'var(--color-text-muted)'}}>Popularity</span>
                  <span style={{fontWeight:'var(--font-weight-semibold)'}}>{selectedCity.popularity_score}/100</span>
                </div>
                <button className="btn-primary" style={{width:'100%', textAlign:'center', justifyContent:'center'}} onClick={() => navigate('/trips/new')}>🗺️ Plan a Trip Here</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitySearch;
