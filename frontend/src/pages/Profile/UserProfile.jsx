import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext.jsx';
import { authAPI } from '../../api/authAPI.js';
import { tripAPI } from '../../api/tripAPI.js';
import { formatDate, daysBetween } from '../../utils/formatDate.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [trips, setTrips] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: user?.first_name||'', lastName: user?.last_name||'', phone: user?.phone||'', city: user?.city||'', country: user?.country||'', additionalInfo: user?.additional_info||'' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    tripAPI.getTrips().then(r => setTrips(r.data.data)).catch(() => {});
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.data);
      setEditing(false);
      toast.success('Profile updated! ✅');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const totalDays = trips.reduce((sum, t) => sum + daysBetween(t.start_date, t.end_date), 0);
  const uniqueCities = new Set(trips.flatMap(t => [])).size; // Would need stops data for exact count
  const initials = `${user?.first_name?.[0]}${user?.last_name?.[0]}`.toUpperCase();

  const upcomingTrips = trips.filter(t => t.status === 'upcoming');
  const completedTrips = trips.filter(t => t.status === 'completed');

  return (
    <div className="page-container" style={{paddingTop:'var(--space-8)', paddingBottom:'var(--space-16)'}}>
      {/* Profile Header */}
      <div className="card" style={{padding:'var(--space-8)', marginBottom:'var(--space-6)', background:'var(--gradient-hero)'}}>
        <div style={{display:'flex', alignItems:'flex-start', gap:'var(--space-6)', flexWrap:'wrap'}}>
          <div style={{width:80, height:80, background:'rgba(255,255,255,0.2)', backdropFilter:'blur(8px)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'var(--font-size-3xl)', fontWeight:'var(--font-weight-extrabold)', color:'white', flexShrink:0}}>
            {initials}
          </div>
          <div style={{flex:1}}>
            <h1 style={{fontSize:'var(--font-size-3xl)', fontWeight:'var(--font-weight-extrabold)', color:'white'}}>{user?.first_name} {user?.last_name}</h1>
            <p style={{color:'rgba(255,255,255,0.8)', marginBottom:'var(--space-1)'}}>{user?.email}</p>
            {user?.city && <p style={{color:'rgba(255,255,255,0.7)', fontSize:'var(--font-size-sm)'}}>📍 {user.city}{user.country ? `, ${user.country}` : ''}</p>}
            <p style={{color:'rgba(255,255,255,0.6)', fontSize:'var(--font-size-sm)', marginTop:'var(--space-2)'}}>Member since {formatDate(user?.created_at, 'MMMM yyyy')}</p>
          </div>
          <button className="btn-secondary" style={{background:'rgba(255,255,255,0.15)', border:'2px solid rgba(255,255,255,0.4)', color:'white'}} onClick={() => setEditing(!editing)}>
            {editing ? '✕ Cancel' : '✏️ Edit Profile'}
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="card" style={{padding:'var(--space-6)', marginBottom:'var(--space-6)'}}>
          <h2 style={{fontWeight:'var(--font-weight-bold)', marginBottom:'var(--space-4)'}}>Edit Profile</h2>
          <div className="form-grid-2">
            {[['firstName','First Name'],['lastName','Last Name'],['phone','Phone'],['city','City'],['country','Country']].map(([k, l]) => (
              <div key={k} className="form-group">
                <label className="input-label">{l}</label>
                <input className="input-field" value={form[k]} onChange={e => setForm({...form, [k]:e.target.value})} />
              </div>
            ))}
          </div>
          <div className="form-group">
            <label className="input-label">Additional Info</label>
            <textarea className="input-field" rows={3} value={form.additionalInfo} onChange={e => setForm({...form, additionalInfo:e.target.value})} style={{resize:'vertical'}} />
          </div>
          <div style={{display:'flex', gap:'var(--space-3)', marginTop:'var(--space-4)'}}>
            <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn-primary" onClick={saveProfile} disabled={saving}>{saving ? '...' : 'Save Changes'}</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-4)', marginBottom:'var(--space-8)'}}>
        {[
          { icon:'🗺️', value:trips.length, label:'Total Trips' },
          { icon:'🗓️', value:totalDays, label:'Days Traveled' },
          { icon:'✅', value:completedTrips.length, label:'Completed' },
        ].map(s => (
          <div key={s.label} className="card" style={{padding:'var(--space-5)', textAlign:'center'}}>
            <div style={{fontSize:28, marginBottom:'var(--space-2)'}}>{s.icon}</div>
            <div style={{fontSize:'var(--font-size-3xl)', fontWeight:'var(--font-weight-extrabold)', color:'var(--color-primary)'}}>{s.value}</div>
            <div style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)'}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Trips */}
      {upcomingTrips.length > 0 && (
        <section style={{marginBottom:'var(--space-8)'}}>
          <h2 className="section-title">📅 Upcoming Trips</h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'var(--space-4)'}}>
            {upcomingTrips.map(t => (
              <Link key={t.id} to={`/trips/${t.id}`} className="card" style={{display:'block', padding:'var(--space-4)'}}>
                <div style={{fontWeight:'var(--font-weight-semibold)', marginBottom:'var(--space-1)'}}>{t.title}</div>
                <div style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)', marginBottom:'var(--space-2)'}}>{formatDate(t.start_date)} — {formatDate(t.end_date)}</div>
                {t.total_budget > 0 && <div style={{fontSize:'var(--font-size-sm)', color:'var(--color-secondary)'}}>{formatCurrency(t.total_budget)} budget</div>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Completed Trips */}
      {completedTrips.length > 0 && (
        <section>
          <h2 className="section-title">✅ Past Adventures</h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'var(--space-4)'}}>
            {completedTrips.map(t => (
              <Link key={t.id} to={`/trips/${t.id}`} className="card" style={{display:'block', padding:'var(--space-4)'}}>
                <div style={{fontWeight:'var(--font-weight-semibold)', marginBottom:'var(--space-1)'}}>{t.title}</div>
                <div style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)'}}>{formatDate(t.start_date)} — {formatDate(t.end_date)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default UserProfile;
