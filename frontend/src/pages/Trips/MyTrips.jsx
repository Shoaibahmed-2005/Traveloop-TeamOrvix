import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tripAPI } from '../../api/tripAPI.js';
import Loader from '../../components/common/Loader.jsx';
import { formatDateRange, daysBetween } from '../../utils/formatDate.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import './Trips.css';

const TripCard = ({ trip, onDelete }) => {
  const navigate = useNavigate();
  const pct = trip.total_budget > 0 ? Math.min(100, Math.round((trip.spent_amount / trip.total_budget) * 100)) : 0;
  const [deleting, setDeleting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try { await tripAPI.deleteTrip(trip.id); onDelete(trip.id); toast.success('Trip deleted'); }
    catch { toast.error('Failed to delete trip'); setDeleting(false); }
  };

  return (
    <div className="trip-card card">
      <div className="trip-card-img" style={{ background: trip.cover_photo ? `url(${trip.cover_photo}) center/cover` : 'var(--gradient-card)' }}>
        <span className={`badge badge-${trip.status}`}>{trip.status}</span>
        {trip.is_public && <span className="trip-public-badge">Public</span>}
      </div>
      <div className="trip-card-body">
        <h3 className="trip-card-title">{trip.title}</h3>
        <p className="trip-card-dates">{formatDateRange(trip.start_date, trip.end_date)} · {daysBetween(trip.start_date, trip.end_date)} days</p>
        {trip.total_budget > 0 && (
          <div className="trip-budget">
            <div className="trip-budget-row">
              <span className="trip-budget-label">Budget</span>
              <span className="trip-budget-value">{pct}% of {formatCurrency(trip.total_budget)}</span>
            </div>
            <div className="progress-bar">
              <div className={`progress-fill ${pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : ''}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
        <div className="trip-card-actions">
          <button className="btn-secondary sm" onClick={() => navigate(`/trips/${trip.id}`)}>View</button>
          <button className="btn-ghost sm" onClick={() => navigate(`/trips/${trip.id}/builder`)}>Edit</button>
          {confirmDel ? (
            <div className="confirm-del">
              <span>Delete?</span>
              <button className="btn-danger sm" onClick={handleDelete} disabled={deleting}>{deleting ? '...' : 'Yes'}</button>
              <button className="btn-ghost sm" onClick={() => setConfirmDel(false)}>No</button>
            </div>
          ) : (
            <button className="btn-ghost sm danger" onClick={() => setConfirmDel(true)}>×</button>
          )}
        </div>
      </div>
    </div>
  );
};

const MyTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');

  useEffect(() => {
    tripAPI.getTrips().then(r => { setTrips(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDelete = (id) => setTrips(prev => prev.filter(t => t.id !== id));

  const filtered = trips
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sort === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      return parseFloat(b.total_budget) - parseFloat(a.total_budget);
    });

  const groups = ['ongoing','upcoming','completed','cancelled'].map(status => ({
    status, label: status.charAt(0).toUpperCase()+status.slice(1),
    trips: filtered.filter(t => filter === 'all' ? t.status === status : true && t.status === status)
  })).filter(g => g.trips.length > 0 || filter === g.status);

  return (
    <div className="page-container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>
      <div className="page-header trips-header">
        <div>
          <h1 className="page-title">My Trips</h1>
          <p className="page-subtitle">{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/trips/new')}>+ Plan New Trip</button>
      </div>

      <div className="trips-toolbar">
        <input className="input-field search-input" placeholder="Search trips..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input-field" value={filter} onChange={e => setFilter(e.target.value)} style={{width:'auto'}}>
          <option value="all">All Statuses</option>
          <option value="ongoing">Ongoing</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select className="input-field" value={sort} onChange={e => setSort(e.target.value)} style={{width:'auto'}}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="budget">Budget (High-Low)</option>
        </select>
      </div>

      {loading ? <Loader count={6} height={220} /> :
        trips.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">→</div>
            <h3 className="empty-state-title">No trips yet</h3>
            <p className="empty-state-text">Start planning your first adventure and make memories that last forever.</p>
            <button className="btn-primary" onClick={() => navigate('/trips/new')}>Plan My First Trip</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⌕</div>
            <h3 className="empty-state-title">No matches</h3>
            <p className="empty-state-text">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          filter === 'all' ? groups.map(group => group.trips.length > 0 && (
            <section key={group.status} className="trip-group">
              <h2 className="trip-group-title">
                <span className={`badge badge-${group.status}`}>{group.label}</span>
                <span className="trip-group-count">{group.trips.length}</span>
              </h2>
              <div className="trips-grid">
                {group.trips.map(trip => <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />)}
              </div>
            </section>
          )) : (
            <div className="trips-grid">
              {filtered.map(trip => <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />)}
            </div>
          )
        )
      }
    </div>
  );
};

export default MyTrips;
