import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext.jsx';
import { tripAPI } from '../../api/tripAPI.js';
import { cityAPI } from '../../api/cityAPI.js';
import Wave from '../../components/common/Wave.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDateRange, daysBetween, daysRemaining } from '../../utils/formatDate.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import './Dashboard.css';

const STAT_ICONS = ['→','◆','◈','₹'];

const StatCard = ({ icon, value, label, color }) => (
  <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
    <div className="stat-icon-circle" style={{ background: color }}>{icon}</div>
    <div className="stat-value" style={{ color }}>{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [popularCities, setPopularCities] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [tripRes, cityRes] = await Promise.all([tripAPI.getTrips(), cityAPI.getPopular()]);
        setTrips(tripRes.data.data);
        const s = {};
        tripRes.data.summary.forEach(r => { s[r.status] = parseInt(r.count); });
        setSummary(s);
        setPopularCities(cityRes.data.data);
      } catch { toast.error('Failed to load dashboard'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const totalSpent = trips.reduce((acc, t) => acc + parseFloat(t.spent_amount || 0), 0);
  const recentTrips = trips.slice(0, 3);

  const getCityGradient = (i) => {
    const grads = ['linear-gradient(135deg,#1B3A6B,#00B4A6)','linear-gradient(135deg,#00B4A6,#0F2444)','linear-gradient(135deg,#2D5AA0,#00D4C4)','linear-gradient(135deg,#0F2444,#00B4A6)','linear-gradient(135deg,#1B3A6B,#4A7FCC)'];
    return grads[i % grads.length];
  };

  return (
    <div className="dashboard">
      <div className="dashboard-hero ocean-bg">
        <div className="page-container">
          <div className="hero-content">
            <div className="accent-line" style={{marginBottom:'var(--space-4)'}} />
            <h1 className="hero-title">Welcome back, {user?.first_name}</h1>
            <p className="hero-sub">Ready to plan your next adventure? The world is waiting.</p>
            <button className="btn-primary hero-cta" onClick={() => navigate('/trips/new')}>Plan New Trip →</button>
          </div>
        </div>
        <Wave color="var(--color-bg)" />
      </div>

      <div className="page-container dashboard-body">
        <div className="stats-grid">
          <StatCard icon="→" value={trips.length} label="Total Trips" color="var(--color-primary)" />
          <StatCard icon="◆" value={summary.ongoing || 0} label="Ongoing" color="var(--status-ongoing)" />
          <StatCard icon="◈" value={summary.upcoming || 0} label="Upcoming" color="var(--status-upcoming)" />
          <StatCard icon="₹" value={formatCurrency(totalSpent)} label="Total Spent" color="var(--color-accent)" />
        </div>

        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Top Destinations</h2>
            <Link to="/explore" className="see-all-link">See all cities →</Link>
          </div>
          <div className="cities-scroll">
            {loading ? Array.from({length:5}).map((_,i) => <div key={i} className="skeleton city-card-skel" />) :
              popularCities.map((city, i) => (
                <div key={city.id} className="city-card" onClick={() => navigate('/explore')}>
                  <div className="city-card-img" style={{ background: getCityGradient(i) }}>
                    <div className="city-card-overlay">
                      <div className="city-cost-badge" style={{color: city.cost_index < 1 ? '#4ade80' : city.cost_index < 2 ? '#f59e0b' : '#ef4444'}}>
                        {'₹'.repeat(Math.min(3, Math.ceil(city.cost_index)))}
                      </div>
                    </div>
                  </div>
                  <div className="city-card-body">
                    <div className="city-name">{city.name}</div>
                    <div className="city-country">{city.country}</div>
                    <div className="city-region-tag">{city.region}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">My Recent Trips</h2>
            <Link to="/trips" className="see-all-link">View all →</Link>
          </div>
          {loading ? <Loader count={3} height={200} /> :
            recentTrips.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">→</div>
                <h3 className="empty-state-title">No trips yet!</h3>
                <p className="empty-state-text">Start planning your first adventure and make memories that last a lifetime.</p>
                <button className="btn-primary" onClick={() => navigate('/trips/new')}>Plan My First Trip</button>
              </div>
            ) : (
              <div className="trips-preview-grid">
                {recentTrips.map(trip => {
                  const pct = trip.total_budget > 0 ? Math.min(100, Math.round((trip.spent_amount / trip.total_budget) * 100)) : 0;
                  return (
                    <Link to={`/trips/${trip.id}`} key={trip.id} className="trip-preview-card card">
                      <div className="trip-preview-img" style={{ background: trip.cover_photo ? `url(${trip.cover_photo})` : 'var(--gradient-card)', backgroundSize: 'cover' }}>
                        <span className={`badge badge-${trip.status}`}>{trip.status}</span>
                      </div>
                      <div className="trip-preview-body">
                        <h3 className="trip-preview-title">{trip.title}</h3>
                        <p className="trip-preview-dates">{formatDateRange(trip.start_date, trip.end_date)}</p>
                        {trip.total_budget > 0 && (
                          <div>
                            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)', marginBottom:4 }}>
                              <span>Budget</span><span>{pct}%</span>
                            </div>
                            <div className="progress-bar">
                              <div className={`progress-fill ${pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : ''}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )
          }
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
