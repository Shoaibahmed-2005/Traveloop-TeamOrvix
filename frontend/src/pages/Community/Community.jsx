import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { communityAPI } from '../../api/communityAPI.js';
import { tripAPI } from '../../api/tripAPI.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { formatDateRange } from '../../utils/formatDate.js';
import Wave from '../../components/common/Wave.jsx';

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [myTrips, setMyTrips] = useState([]);
  const [showPublish, setShowPublish] = useState(false);
  const [publishForm, setPublishForm] = useState({ tripId:'', description:'' });
  const [publishing, setPublishing] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const loadPosts = async () => {
    try { const { data } = await communityAPI.getPosts({ search: debouncedSearch, sort }); setPosts(data.data); }
    catch { toast.error('Failed to load community posts'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPosts(); }, [debouncedSearch, sort]);

  const openPublish = async () => {
    try { const { data } = await tripAPI.getTrips(); setMyTrips(data.data.filter(t => !t.is_public)); setShowPublish(true); }
    catch { toast.error('Failed to load trips'); }
  };

  const publishTrip = async () => {
    if (!publishForm.tripId) { toast.error('Select a trip to publish'); return; }
    setPublishing(true);
    try {
      await communityAPI.publishTrip(publishForm.tripId, { description: publishForm.description });
      toast.success('Trip published to community!');
      setShowPublish(false);
      loadPosts();
    } catch { toast.error('Failed to publish'); }
    finally { setPublishing(false); }
  };

  const likePost = async (postId, e) => {
    e.stopPropagation();
    try {
      const { data } = await communityAPI.likePost(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: data.data.likes_count } : p));
    } catch {}
  };

  const GRADIENTS = ['linear-gradient(135deg,#1B3A6B,#00B4A6)','linear-gradient(135deg,#2D5AA0,#00D4C4)','linear-gradient(135deg,#0F2444,#00B4A6)','linear-gradient(135deg,#1B3A6B,#4A7FCC)','linear-gradient(135deg,#00B4A6,#0F2444)'];

  return (
    <div style={{paddingBottom:'var(--space-16)'}}>
      <div className="ocean-bg" style={{padding:'var(--space-12) 0 0'}}>
        <div className="page-container" style={{position:'relative', zIndex:2}}>
          <div className="accent-line" style={{marginBottom:'var(--space-4)'}} />
          <h1 style={{fontSize:'var(--font-size-4xl)', fontWeight:'var(--font-weight-extrabold)', color:'white', marginBottom:'var(--space-3)'}}>Travel Community</h1>
          <p style={{fontSize:'var(--font-size-lg)', color:'rgba(255,255,255,0.8)', marginBottom:'var(--space-6)'}}>Discover amazing trips and inspire fellow travelers</p>
          <button className="btn-primary" style={{background:'white', color:'var(--color-primary)'}} onClick={openPublish}>Share My Trip →</button>
        </div>
        <Wave color="var(--color-bg)" />
      </div>

      <div className="page-container" style={{paddingTop:'var(--space-6)'}}>
        <div style={{display:'flex', gap:'var(--space-3)', marginBottom:'var(--space-6)', flexWrap:'wrap'}}>
          <input className="input-field" placeholder="Search trips, destinations..." value={search} onChange={e => setSearch(e.target.value)} style={{flex:1, minWidth:200}} />
          <select className="input-field" value={sort} onChange={e => setSort(e.target.value)} style={{width:'auto'}}>
            <option value="recent">Most Recent</option>
            <option value="likes">Most Liked</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>

        {loading ? <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'var(--space-5)'}}>
          {[...Array(6)].map((_,i) => <div key={i} className="skeleton" style={{height:280, borderRadius:'var(--radius-lg)'}} />)}
        </div> : posts.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">→</div><h3 className="empty-state-title">No posts yet</h3><p className="empty-state-text">Be the first to share your trip with the community!</p><button className="btn-primary" onClick={openPublish}>Share a Trip</button></div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'var(--space-5)'}}>
            {posts.map((post, i) => (
              <div key={post.id} className="card" style={{cursor:'pointer', overflow:'hidden'}} onClick={() => navigate(`/trips/${post.trip_id}`)}>
                <div style={{height:180, background: post.cover_photo ? `url(${post.cover_photo}) center/cover` : GRADIENTS[i % GRADIENTS.length], display:'flex', alignItems:'flex-end', padding:'var(--space-3)'}}>
                  <div style={{display:'flex', gap:'var(--space-2)', alignItems:'center'}}>
                    <div style={{width:32, height:32, background:'rgba(255,255,255,0.2)', backdropFilter:'blur(4px)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'var(--font-weight-bold)', color:'white', fontSize:'var(--font-size-sm)', flexShrink:0}}>
                      {post.first_name?.[0]}{post.last_name?.[0]}
                    </div>
                    <span style={{color:'white', fontSize:'var(--font-size-sm)', fontWeight:'var(--font-weight-semibold)'}}>{post.first_name} {post.last_name}</span>
                  </div>
                </div>
                <div style={{padding:'var(--space-4)'}}>
                  <h3 style={{fontWeight:'var(--font-weight-bold)', color:'var(--color-text-primary)', marginBottom:'var(--space-1)'}}>{post.title}</h3>
                  <p style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)', marginBottom:'var(--space-3)'}}>{formatDateRange(post.start_date, post.end_date)}</p>
                  {post.description && <p style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-secondary)', marginBottom:'var(--space-3)', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical'}}>{post.description}</p>}
                  <div style={{display:'flex', alignItems:'center', gap:'var(--space-4)'}}>
                    <button onClick={(e) => likePost(post.id, e)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)', display:'flex', alignItems:'center', gap:4}}>
                      ♥ {post.likes_count}
                    </button>
                    <span style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)'}}>{post.views_count} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPublish && (
        <div className="modal-overlay" onClick={() => setShowPublish(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Share a Trip</h3>
              <button className="btn-ghost" onClick={() => setShowPublish(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="input-label">Select Trip *</label>
                <select className="input-field" value={publishForm.tripId} onChange={e => setPublishForm({...publishForm, tripId:e.target.value})}>
                  <option value="">Choose a trip...</option>
                  {myTrips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
                {myTrips.length === 0 && <p style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)', marginTop:'var(--space-2)'}}>All your trips are already public, or you have no trips yet.</p>}
              </div>
              <div className="form-group">
                <label className="input-label">Description</label>
                <textarea className="input-field" rows={4} placeholder="Tell the community about your trip..." value={publishForm.description} onChange={e => setPublishForm({...publishForm, description:e.target.value})} style={{resize:'vertical'}} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowPublish(false)}>Cancel</button>
              <button className="btn-primary" onClick={publishTrip} disabled={publishing}>{publishing ? '...' : 'Publish Trip'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
