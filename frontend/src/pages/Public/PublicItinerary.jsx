import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { communityAPI } from '../../api/communityAPI.js';
import { formatDateRange } from '../../utils/formatDate.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { toast } from 'react-toastify';
import Wave from '../../components/common/Wave.jsx';

const SECTION_ICONS = { hotel:'H', transport:'T', activity:'A', meal:'M', other:'·' };

const PublicItinerary = () => {
  const { shareToken } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    communityAPI.getPublicItinerary(shareToken)
      .then(r => setData(r.data.data))
      .catch(() => setError('This itinerary is not available or is set to private.'))
      .finally(() => setLoading(false));
  }, [shareToken]);

  const copyLink = () => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); };
  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent('Check out this trip on Traveloop! ' + window.location.href)}`);
  const shareX = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this amazing trip on Traveloop!')}&url=${encodeURIComponent(window.location.href)}`);

  if (loading) return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--color-bg)'}}>
      <div style={{textAlign:'center'}}><div className="spinner spinner-dark" style={{width:40, height:40, margin:'0 auto 16px'}} /><p style={{color:'var(--color-text-muted)'}}>Loading itinerary...</p></div>
    </div>
  );

  if (error) return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--color-bg)'}}>
      <div className="empty-state"><div className="empty-state-icon">×</div><h2 className="empty-state-title">Itinerary Not Found</h2><p className="empty-state-text">{error}</p><Link to="/login" className="btn-primary">Sign in to Traveloop</Link></div>
    </div>
  );

  const { trip, stops, sections } = data;

  return (
    <div style={{minHeight:'100vh', background:'var(--color-bg)'}}>
      <div style={{background:'var(--color-surface)', borderBottom:'1px solid var(--color-border)', padding:'var(--space-4) var(--space-6)', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <Link to="/">
          <img src="/logo.png" alt="Traveloop" height="42" style={{objectFit:'contain'}} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
          <span style={{display:'none', fontSize:'var(--font-size-xl)', fontWeight:'var(--font-weight-extrabold)', background:'var(--gradient-brand)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>Traveloop</span>
        </Link>
        <Link to="/login" className="btn-primary" style={{padding:'8px 20px'}}>View on Traveloop →</Link>
      </div>

      <div className="ocean-bg" style={{padding:'var(--space-12) var(--space-6) 0'}}>
        <div style={{maxWidth:900, margin:'0 auto', position:'relative', zIndex:2, paddingBottom:'var(--space-6)'}}>
          <div className="accent-line" style={{marginBottom:'var(--space-4)'}} />
          <h1 style={{fontSize:'var(--font-size-4xl)', fontWeight:'var(--font-weight-extrabold)', color:'white', marginBottom:'var(--space-3)'}}>{trip.title}</h1>
          <div style={{display:'flex', alignItems:'center', gap:'var(--space-4)', flexWrap:'wrap', marginBottom:'var(--space-5)'}}>
            <div style={{display:'flex', alignItems:'center', gap:'var(--space-2)'}}>
              <div style={{width:36, height:36, background:'rgba(255,255,255,0.15)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'var(--font-weight-bold)', color:'white', fontSize:'var(--font-size-sm)'}}>{trip.first_name?.[0]}{trip.last_name?.[0]}</div>
              <span style={{color:'rgba(255,255,255,0.9)'}}>{trip.first_name} {trip.last_name}</span>
            </div>
            <span style={{color:'rgba(255,255,255,0.7)'}}>{formatDateRange(trip.start_date, trip.end_date)}</span>
            <span style={{color:'rgba(255,255,255,0.7)'}}>{stops.length} destinations</span>
          </div>
          <div style={{display:'flex', gap:'var(--space-3)'}}>
            <button className="btn-secondary" style={{background:'rgba(255,255,255,0.12)', border:'1.5px solid rgba(255,255,255,0.3)', color:'white'}} onClick={shareWhatsApp}>WhatsApp</button>
            <button className="btn-secondary" style={{background:'rgba(255,255,255,0.12)', border:'1.5px solid rgba(255,255,255,0.3)', color:'white'}} onClick={shareX}>X (Twitter)</button>
            <button className="btn-secondary" style={{background:'rgba(255,255,255,0.12)', border:'1.5px solid rgba(255,255,255,0.3)', color:'white'}} onClick={copyLink}>Copy Link</button>
            <Link to="/login" className="btn-primary" style={{background:'white', color:'var(--color-primary)'}}>Copy This Trip</Link>
          </div>
        </div>
        <Wave color="var(--color-bg)" />
      </div>

      <div style={{maxWidth:900, margin:'0 auto', padding:'var(--space-6) var(--space-6) var(--space-16)'}}>
        {trip.total_budget > 0 && (
          <div className="card" style={{padding:'var(--space-4)', marginBottom:'var(--space-6)', display:'flex', alignItems:'center', gap:'var(--space-4)'}}>
            <div className="icon-circle md brand">₹</div>
            <div><div style={{fontWeight:'var(--font-weight-semibold)'}}>Trip Budget</div><div style={{fontSize:'var(--font-size-xl)', fontWeight:'var(--font-weight-extrabold)', color:'var(--color-primary)'}}>{formatCurrency(trip.total_budget)}</div></div>
          </div>
        )}

        {stops.map((stop, idx) => {
          const stopSections = sections.filter(s => s.trip_stop_id === stop.id);
          return (
            <div key={stop.id} style={{marginBottom:'var(--space-8)'}}>
              <div style={{display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-4)', background:'var(--gradient-brand)', borderRadius:'var(--radius-lg)', marginBottom:'var(--space-4)', color:'white'}}>
                <div style={{width:36, height:36, background:'rgba(255,255,255,0.15)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'var(--font-weight-bold)'}}>{idx+1}</div>
                <div><div style={{fontWeight:'var(--font-weight-bold)', fontSize:'var(--font-size-lg)'}}>{stop.city_name}, {stop.country}</div><div style={{fontSize:'var(--font-size-sm)', opacity:0.8}}>{formatDateRange(stop.arrival_date, stop.departure_date)}</div></div>
              </div>
              {stopSections.length === 0 ? <p style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)', padding:'var(--space-4)'}}>No sections added for this stop.</p> :
                stopSections.map(section => (
                  <div key={section.id} className="card" style={{padding:'var(--space-4)', marginBottom:'var(--space-3)', display:'flex', gap:'var(--space-3)', alignItems:'flex-start'}}>
                    <div className="icon-circle sm teal">{SECTION_ICONS[section.section_type] || '·'}</div>
                    <div style={{flex:1}}><div style={{fontWeight:'var(--font-weight-semibold)'}}>{section.title}</div>{section.start_date && <div style={{fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)', marginTop:2}}>{formatDateRange(section.start_date, section.end_date)}</div>}{section.description && <div style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)', marginTop:'var(--space-2)'}}>{section.description}</div>}</div>
                    {section.estimated_cost > 0 && <span style={{fontWeight:'var(--font-weight-bold)', color:'var(--color-secondary)', whiteSpace:'nowrap'}}>{formatCurrency(section.estimated_cost)}</span>}
                  </div>
                ))
              }
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PublicItinerary;
