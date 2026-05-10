import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api/axiosInstance.js';
import { formatDate } from '../../utils/formatDate.js';

const COLORS = ['#1B3A6B','#00B4A6','#F4A340','#EF4444','#10B981'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/dashboard'); return; }
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/trips'),
    ]).then(([sRes, uRes, tRes]) => {
      setStats(sRes.data.data);
      setUsers(uRes.data.data);
      setTrips(tRes.data.data);
    }).catch(() => toast.error('Failed to load admin data'))
    .finally(() => setLoading(false));
  }, []);

  const toggleUser = async (id) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/status`);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: data.data.is_active } : u));
      toast.success('User status updated');
    } catch { toast.error('Failed to update user'); }
  };

  if (loading) return <div className="page-container" style={{paddingTop:'var(--space-10)'}}>
    {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{height:100, borderRadius:'var(--radius-lg)', marginBottom:'var(--space-4)'}} />)}
  </div>;

  const pieData = stats?.statusBreakdown?.map(s => ({ name: s.status, value: parseInt(s.count) })) || [];

  return (
    <div style={{paddingBottom:'var(--space-16)'}}>
      <div style={{background:'var(--gradient-card)', padding:'var(--space-8) 0'}}>
        <div className="page-container">
          <h1 style={{fontSize:'var(--font-size-3xl)', fontWeight:'var(--font-weight-extrabold)', color:'white', marginBottom:'var(--space-2)'}}>🛡️ Admin Dashboard</h1>
          <p style={{color:'rgba(255,255,255,0.7)'}}>Platform overview and management</p>
        </div>
      </div>

      <div className="page-container" style={{paddingTop:'var(--space-8)'}}>
        {/* Stats Cards */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--space-4)', marginBottom:'var(--space-8)'}}>
          {[
            { icon:'👥', label:'Total Users', value: stats?.totalUsers, color:'var(--color-primary)' },
            { icon:'🗺️', label:'Total Trips', value: stats?.totalTrips, color:'var(--color-secondary)' },
            { icon:'🌍', label:'Public Trips', value: stats?.publicTrips, color:'var(--color-accent)' },
            { icon:'🆕', label:'New Users (30d)', value: stats?.newUsersLast30Days, color:'#10B981' },
          ].map(s => (
            <div key={s.label} className="card" style={{padding:'var(--space-5)', borderTop:`3px solid ${s.color}`}}>
              <div style={{fontSize:24, marginBottom:'var(--space-2)'}}>{s.icon}</div>
              <div style={{fontSize:'var(--font-size-3xl)', fontWeight:'var(--font-weight-extrabold)', color:s.color}}>{s.value ?? '—'}</div>
              <div style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {stats?.topCity && (
          <div className="card" style={{padding:'var(--space-4)', marginBottom:'var(--space-6)', display:'flex', alignItems:'center', gap:'var(--space-3)', background:'var(--color-success-bg)', border:'1px solid var(--color-secondary)'}}>
            <span style={{fontSize:28}}>🏆</span>
            <div><div style={{fontWeight:'var(--font-weight-bold)'}}>Most Popular Destination</div><div style={{color:'var(--color-secondary)', fontWeight:'var(--font-weight-extrabold)', fontSize:'var(--font-size-xl)'}}>{stats.topCity.name}</div></div>
          </div>
        )}

        {/* Chart */}
        {pieData.length > 0 && (
          <div className="card" style={{padding:'var(--space-6)', marginBottom:'var(--space-8)'}}>
            <h3 style={{fontWeight:'var(--font-weight-bold)', marginBottom:'var(--space-4)'}}>Trips by Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart><Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({name, value}) => `${name}: ${value}`}>
                {pieData.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tabs */}
        <div style={{display:'flex', gap:'var(--space-2)', marginBottom:'var(--space-5)', borderBottom:'1px solid var(--color-border)'}}>
          {['users','trips'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{padding:'var(--space-3) var(--space-5)', fontWeight:'var(--font-weight-semibold)', borderBottom: activeTab === tab ? '2px solid var(--color-secondary)' : '2px solid transparent', color: activeTab === tab ? 'var(--color-secondary)' : 'var(--color-text-muted)', background:'none', border:'none', borderBottom: activeTab === tab ? '2px solid var(--color-secondary)' : '2px solid transparent', cursor:'pointer', fontSize:'var(--font-size-base)'}}>
              {tab === 'users' ? `👥 Users (${users.length})` : `🗺️ Trips (${trips.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'users' && (
          <div className="card" style={{overflow:'hidden'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead><tr style={{background:'var(--color-surface-2)', borderBottom:'1px solid var(--color-border)'}}>
                {['Name','Email','Trips','Joined','Status','Action'].map(h => <th key={h} style={{padding:'var(--space-3) var(--space-4)', textAlign:'left', fontSize:'var(--font-size-xs)', fontWeight:'var(--font-weight-semibold)', color:'var(--color-text-muted)', textTransform:'uppercase'}}>{h}</th>)}
              </tr></thead>
              <tbody>{users.map((u, i) => (
                <tr key={u.id} style={{borderBottom: i < users.length-1 ? '1px solid var(--color-border-light)' : 'none'}}>
                  <td style={{padding:'var(--space-3) var(--space-4)', fontWeight:'var(--font-weight-semibold)'}}>{u.first_name} {u.last_name}</td>
                  <td style={{padding:'var(--space-3) var(--space-4)', fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)'}}>{u.email}</td>
                  <td style={{padding:'var(--space-3) var(--space-4)'}}>{u.trip_count}</td>
                  <td style={{padding:'var(--space-3) var(--space-4)', fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)'}}>{formatDate(u.created_at)}</td>
                  <td style={{padding:'var(--space-3) var(--space-4)'}}><span className={`badge ${u.is_active ? 'badge-ongoing' : 'badge-cancelled'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td style={{padding:'var(--space-3) var(--space-4)'}}>{u.role !== 'admin' && <button className={`btn-ghost ${!u.is_active ? '' : 'danger'}`} style={{fontSize:'var(--font-size-xs)', padding:'4px 10px', color: u.is_active ? 'var(--color-error)' : 'var(--color-success)'}} onClick={() => toggleUser(u.id)}>{u.is_active ? 'Deactivate' : 'Activate'}</button>}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeTab === 'trips' && (
          <div className="card" style={{overflow:'hidden'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead><tr style={{background:'var(--color-surface-2)', borderBottom:'1px solid var(--color-border)'}}>
                {['Title','User','Start','End','Status','Public'].map(h => <th key={h} style={{padding:'var(--space-3) var(--space-4)', textAlign:'left', fontSize:'var(--font-size-xs)', fontWeight:'var(--font-weight-semibold)', color:'var(--color-text-muted)', textTransform:'uppercase'}}>{h}</th>)}
              </tr></thead>
              <tbody>{trips.slice(0,50).map((t, i) => (
                <tr key={t.id} style={{borderBottom: i < trips.length-1 ? '1px solid var(--color-border-light)' : 'none'}}>
                  <td style={{padding:'var(--space-3) var(--space-4)', fontWeight:'var(--font-weight-medium)'}}>{t.title}</td>
                  <td style={{padding:'var(--space-3) var(--space-4)', fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)'}}>{t.first_name} {t.last_name}</td>
                  <td style={{padding:'var(--space-3) var(--space-4)', fontSize:'var(--font-size-sm)'}}>{formatDate(t.start_date)}</td>
                  <td style={{padding:'var(--space-3) var(--space-4)', fontSize:'var(--font-size-sm)'}}>{formatDate(t.end_date)}</td>
                  <td style={{padding:'var(--space-3) var(--space-4)'}}><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                  <td style={{padding:'var(--space-3) var(--space-4)'}}>{t.is_public ? '🌍' : '🔒'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
