import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tripAPI } from '../../api/tripAPI.js';
import { formatDateRange, daysBetween, daysRemaining } from '../../utils/formatDate.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useAuth } from '../../context/AuthContext.jsx';
import './TripDetail.css';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([tripAPI.getTrip(id), tripAPI.getSummary(id)])
      .then(([tripRes, sumRes]) => { setTrip(tripRes.data.data); setSummary(sumRes.data.data); })
      .catch(() => { toast.error('Trip not found'); navigate('/trips'); })
      .finally(() => setLoading(false));
  }, [id]);

  const copyShareLink = () => {
    if (trip?.share_token) {
      navigator.clipboard.writeText(`${window.location.origin}/share/${trip.share_token}`);
      toast.success('Share link copied! 🔗');
    }
  };

  const togglePublic = async () => {
    try { const { data } = await tripAPI.toggleVisibility(id); setTrip(prev => ({...prev, is_public: data.data.is_public})); toast.success(data.data.is_public ? 'Trip is now public!' : 'Trip set to private'); }
    catch { toast.error('Failed to update visibility'); }
  };

  if (loading) return (
    <div className="page-container" style={{paddingTop:'var(--space-10)'}}>
      <div className="skeleton" style={{height:300, borderRadius:'var(--radius-xl)', marginBottom:'var(--space-6)'}} />
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--space-4)'}}>
        {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{height:100,borderRadius:'var(--radius-lg)'}} />)}
      </div>
    </div>
  );
  if (!trip) return null;

  const pct = trip.total_budget > 0 ? Math.min(100, Math.round((trip.spent_amount / trip.total_budget) * 100)) : 0;
  const remaining = daysRemaining(trip.start_date);

  const quickLinks = [
    { to: `/trips/${id}/builder`, icon:'🗺️', label:'Itinerary Builder' },
    { to: `/trips/${id}/itinerary`, icon:'📋', label:'View Itinerary' },
    { to: `/trips/${id}/budget`, icon:'💰', label:'Budget & Expenses' },
    { to: `/trips/${id}/checklist`, icon:'✅', label:'Packing Checklist' },
    { to: `/trips/${id}/notes`, icon:'📝', label:'Trip Notes' },
  ];

  return (
    <div style={{paddingBottom:'var(--space-16)'}}>
      <div className="trip-detail-hero" style={{background: trip.cover_photo ? `linear-gradient(rgba(15,36,68,0.7),rgba(15,36,68,0.9)), url(${trip.cover_photo}) center/cover` : 'var(--gradient-hero)'}}>
        <div className="page-container">
          <div className="trip-detail-hero-content">
            <Link to="/trips" className="back-link">← My Trips</Link>
            <span className={`badge badge-${trip.status}`} style={{marginBottom:'var(--space-3)'}}>{trip.status}</span>
            <h1 className="trip-detail-title">{trip.title}</h1>
            {trip.description && <p className="trip-detail-desc">{trip.description}</p>}
            <p className="trip-detail-dates">📅 {formatDateRange(trip.start_date, trip.end_date)}</p>
            <div className="trip-detail-actions">
              <button className="btn-primary" onClick={() => navigate(`/trips/${id}/builder`)}>✏️ Edit Itinerary</button>
              <button className="btn-secondary" style={{background:'rgba(255,255,255,0.15)',border:'2px solid rgba(255,255,255,0.4)',color:'white'}} onClick={copyShareLink}>🔗 Share</button>
              <button className="btn-secondary" style={{background:'rgba(255,255,255,0.15)',border:'2px solid rgba(255,255,255,0.4)',color:'white'}} onClick={togglePublic}>
                {trip.is_public ? '🔒 Make Private' : '🌍 Make Public'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container">
        <div className="trip-detail-stats">
          <div className="td-stat-card">
            <div className="td-stat-icon">📍</div>
            <div className="td-stat-val">{summary?.stopCount || 0}</div>
            <div className="td-stat-label">Destinations</div>
          </div>
          <div className="td-stat-card">
            <div className="td-stat-icon">🗓️</div>
            <div className="td-stat-val">{summary?.totalDays || daysBetween(trip.start_date, trip.end_date)}</div>
            <div className="td-stat-label">Total Days</div>
          </div>
          <div className="td-stat-card">
            <div className="td-stat-icon">⏳</div>
            <div className="td-stat-val">{remaining}</div>
            <div className="td-stat-label">Days Until Trip</div>
          </div>
          <div className="td-stat-card">
            <div className="td-stat-icon">💰</div>
            <div className="td-stat-val">{formatCurrency(trip.spent_amount, user?.country)}</div>
            <div className="td-stat-label">of {formatCurrency(trip.total_budget, user?.country)}</div>
          </div>
        </div>

        {trip.total_budget > 0 && (
          <div className="td-budget-card card" style={{padding:'var(--space-5)', marginBottom:'var(--space-6)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--space-3)'}}>
              <span style={{fontWeight:'var(--font-weight-semibold)'}}>Budget Progress</span>
              <span style={{fontWeight:'var(--font-weight-bold)', color: pct >= 100 ? 'var(--color-error)' : pct >= 80 ? 'var(--color-warning)' : 'var(--color-secondary)'}}>{pct}%</span>
            </div>
            <div className="progress-bar" style={{height:12}}>
              <div className={`progress-fill ${pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : ''}`} style={{width:`${pct}%`}} />
            </div>
            {pct >= 80 && <p style={{fontSize:'var(--font-size-sm)', marginTop:'var(--space-2)', color: pct >= 100 ? 'var(--color-error)' : 'var(--color-warning)'}}>{pct >= 100 ? '🚨 Over budget!' : '⚠️ Approaching budget limit'}</p>}
          </div>
        )}

        <div className="quick-links-grid">
          {quickLinks.map(ql => (
            <Link to={ql.to} key={ql.to} className="quick-link-card card">
              <span className="ql-icon">{ql.icon}</span>
              <span className="ql-label">{ql.label}</span>
              <span className="ql-arrow">→</span>
            </Link>
          ))}
        </div>

        {trip.stops && trip.stops.length > 0 && (
          <div style={{marginTop:'var(--space-8)'}}>
            <h2 className="section-title">📍 Trip Stops</h2>
            <div className="stops-list">
              {trip.stops.map((stop, i) => (
                <div key={stop.id} className="stop-item card">
                  <div className="stop-number">{i + 1}</div>
                  <div>
                    <div className="stop-city">{stop.city_name}, {stop.country}</div>
                    <div className="stop-dates">{formatDateRange(stop.arrival_date, stop.departure_date)} · {daysBetween(stop.arrival_date, stop.departure_date)} days</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetail;
