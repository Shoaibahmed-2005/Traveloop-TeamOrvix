import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { itineraryAPI } from '../../api/itineraryAPI.js';
import { tripAPI } from '../../api/tripAPI.js';
import { formatDateRange } from '../../utils/formatDate.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useAuth } from '../../context/AuthContext.jsx';

const SECTION_ICONS = { hotel:'🏨', transport:'🚂', activity:'🎯', meal:'🍽️', other:'📌' };

const ItineraryView = () => {
  const { id: tripId } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [sectionsMap, setSectionsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [tripRes, stopsRes] = await Promise.all([tripAPI.getTrip(tripId), itineraryAPI.getStops(tripId)]);
        setTrip(tripRes.data.data);
        setStops(stopsRes.data.data);
        const secPromises = stopsRes.data.data.map(s => itineraryAPI.getSections(tripId, s.id).then(r => ({ stopId: s.id, sections: r.data.data })));
        const allSections = await Promise.all(secPromises);
        const map = {};
        allSections.forEach(({ stopId, sections }) => { map[stopId] = sections; });
        setSectionsMap(map);
      } catch { toast.error('Failed to load itinerary'); }
      finally { setLoading(false); }
    };
    load();
  }, [tripId]);

  const copyShare = () => {
    if (trip?.share_token) {
      navigator.clipboard.writeText(`${window.location.origin}/share/${trip.share_token}`);
      toast.success('Share link copied! 🔗');
    }
  };

  const totalCost = Object.values(sectionsMap).flat().reduce((sum, s) => sum + parseFloat(s.estimated_cost || 0), 0);

  if (loading) return <div className="page-container" style={{paddingTop:'var(--space-10)'}}>
    {[...Array(3)].map((_,i) => <div key={i} className="skeleton" style={{height:200, borderRadius:'var(--radius-lg)', marginBottom:'var(--space-4)'}} />)}
  </div>;

  return (
    <div style={{paddingBottom:'var(--space-16)'}}>
      <div style={{background:'var(--gradient-brand)', padding:'var(--space-8) 0'}}>
        <div className="page-container">
          <Link to={`/trips/${tripId}`} style={{color:'rgba(255,255,255,0.7)', fontSize:'var(--font-size-sm)'}}>← Back to Trip</Link>
          <h1 style={{fontSize:'var(--font-size-3xl)', fontWeight:'var(--font-weight-extrabold)', color:'white', margin:'var(--space-3) 0 var(--space-2)'}}>{trip?.title}</h1>
          <p style={{color:'rgba(255,255,255,0.8)', marginBottom:'var(--space-5)'}}>{formatDateRange(trip?.start_date, trip?.end_date)} · {stops.length} destinations</p>
          <div style={{display:'flex', gap:'var(--space-3)'}}>
            <Link to={`/trips/${tripId}/builder`} className="btn-secondary" style={{background:'rgba(255,255,255,0.15)', border:'2px solid rgba(255,255,255,0.4)', color:'white'}}>✏️ Edit</Link>
            <button className="btn-secondary" style={{background:'rgba(255,255,255,0.15)', border:'2px solid rgba(255,255,255,0.4)', color:'white'}} onClick={copyShare}>🔗 Share Link</button>
            <Link to={`/trips/${tripId}/budget`} className="btn-primary" style={{background:'var(--gradient-accent)', color:'var(--color-primary-dark)'}}>💰 Budget</Link>
          </div>
        </div>
      </div>

      <div className="page-container" style={{paddingTop:'var(--space-8)'}}>
        <div style={{display:'flex', gap:'var(--space-6)', alignItems:'flex-start'}}>
          <div style={{flex:1}}>
            {stops.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3 className="empty-state-title">No itinerary yet</h3>
                <p className="empty-state-text">Add stops and sections in the Itinerary Builder.</p>
                <Link to={`/trips/${tripId}/builder`} className="btn-primary">Build Itinerary</Link>
              </div>
            ) : stops.map((stop, idx) => (
              <div key={stop.id} style={{marginBottom:'var(--space-8)'}}>
                <div style={{display:'flex', alignItems:'center', gap:'var(--space-3)', marginBottom:'var(--space-4)', padding:'var(--space-4)', background:'var(--gradient-brand)', borderRadius:'var(--radius-lg)', color:'white'}}>
                  <div style={{width:32, height:32, background:'rgba(255,255,255,0.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'var(--font-weight-bold)'}}>{idx+1}</div>
                  <div>
                    <div style={{fontWeight:'var(--font-weight-bold)', fontSize:'var(--font-size-lg)'}}>{stop.city_name}, {stop.country}</div>
                    <div style={{fontSize:'var(--font-size-sm)', opacity:0.8}}>{formatDateRange(stop.arrival_date, stop.departure_date)}</div>
                  </div>
                </div>
                {(sectionsMap[stop.id] || []).length === 0 ? (
                  <div style={{padding:'var(--space-5)', background:'var(--color-surface-2)', borderRadius:'var(--radius-md)', color:'var(--color-text-muted)', fontSize:'var(--font-size-sm)', textAlign:'center'}}>
                    No sections added yet. <Link to={`/trips/${tripId}/builder`} style={{color:'var(--color-secondary)'}}>Add sections →</Link>
                  </div>
                ) : (sectionsMap[stop.id] || []).map(section => (
                  <div key={section.id} className="card" style={{padding:'var(--space-4)', marginBottom:'var(--space-3)', display:'flex', alignItems:'flex-start', gap:'var(--space-3)'}}>
                    <span style={{fontSize:24}}>{SECTION_ICONS[section.section_type] || '📌'}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:'var(--font-weight-semibold)', color:'var(--color-text-primary)'}}>{section.title}</div>
                      {section.start_date && <div style={{fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)', marginTop:2}}>{formatDateRange(section.start_date, section.end_date)}</div>}
                      {section.description && <div style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)', marginTop:'var(--space-2)'}}>{section.description}</div>}
                    </div>
                    {section.estimated_cost > 0 && (
                      <span style={{fontWeight:'var(--font-weight-bold)', color:'var(--color-secondary)', fontSize:'var(--font-size-sm)', whiteSpace:'nowrap'}}>{formatCurrency(section.estimated_cost, user?.country)}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Right sidebar */}
          <div style={{width:240, flexShrink:0}}>
            <div className="card" style={{padding:'var(--space-5)', marginBottom:'var(--space-4)'}}>
              <h3 style={{fontWeight:'var(--font-weight-bold)', marginBottom:'var(--space-4)'}}>💰 Budget Summary</h3>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'var(--space-2)', fontSize:'var(--font-size-sm)'}}>
                <span style={{color:'var(--color-text-muted)'}}>Total Budget</span>
                <span style={{fontWeight:'var(--font-weight-semibold)'}}>{formatCurrency(trip?.total_budget || 0, user?.country)}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'var(--space-2)', fontSize:'var(--font-size-sm)'}}>
                <span style={{color:'var(--color-text-muted)'}}>Spent</span>
                <span style={{fontWeight:'var(--font-weight-semibold)', color:'var(--color-error)'}}>{formatCurrency(trip?.spent_amount || 0, user?.country)}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'var(--space-4)', fontSize:'var(--font-size-sm)'}}>
                <span style={{color:'var(--color-text-muted)'}}>Estimated</span>
                <span style={{fontWeight:'var(--font-weight-semibold)', color:'var(--color-secondary)'}}>{formatCurrency(totalCost, user?.country)}</span>
              </div>
              <Link to={`/trips/${tripId}/budget`} className="btn-primary" style={{width:'100%', textAlign:'center', display:'block', padding:'10px'}}>+ Add Expense</Link>
            </div>
            <div className="card" style={{padding:'var(--space-5)'}}>
              <h3 style={{fontWeight:'var(--font-weight-bold)', marginBottom:'var(--space-3)'}}>🗺️ Stops ({stops.length})</h3>
              {stops.map((stop, i) => (
                <div key={stop.id} style={{display:'flex', alignItems:'center', gap:'var(--space-2)', marginBottom:'var(--space-2)', fontSize:'var(--font-size-sm)'}}>
                  <span style={{width:20, height:20, background:'var(--gradient-brand)', color:'white', borderRadius:'50%', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:'var(--font-weight-bold)', flexShrink:0}}>{i+1}</span>
                  <span style={{color:'var(--color-text-primary)'}}>{stop.city_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
