import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { noteAPI } from '../../api/noteAPI.js';
import { formatDate } from '../../utils/formatDate.js';

const NOTE_TYPES = ['general','hotel','reminder','contact','day-specific'];
const NOTE_ICONS = { general:'📝', hotel:'🏨', reminder:'⏰', contact:'📞', 'day-specific':'📅' };

const TripNotes = () => {
  const { id: tripId } = useParams();
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [form, setForm] = useState({ title:'', content:'', noteType:'general' });
  const [viewNote, setViewNote] = useState(null);

  const load = async () => {
    try { const { data } = await noteAPI.getNotes(tripId); setNotes(data.data); }
    catch { toast.error('Failed to load notes'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [tripId]);

  const saveNote = async () => {
    if (!form.content.trim()) { toast.error('Note content required'); return; }
    try {
      if (editNote) {
        const { data } = await noteAPI.updateNote(tripId, editNote.id, { title: form.title, content: form.content, noteType: form.noteType });
        setNotes(prev => prev.map(n => n.id === editNote.id ? data.data : n));
        toast.success('Note updated');
      } else {
        const { data } = await noteAPI.addNote(tripId, { title: form.title, content: form.content, noteType: form.noteType });
        setNotes(prev => [data.data, ...prev]);
        toast.success('Note saved! 📝');
      }
      setShowModal(false); setEditNote(null); setForm({ title:'', content:'', noteType:'general' });
    } catch { toast.error('Failed to save note'); }
  };

  const deleteNote = async (id) => {
    try { await noteAPI.deleteNote(tripId, id); setNotes(prev => prev.filter(n => n.id !== id)); toast.success('Note deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = filter === 'all' ? notes : notes.filter(n => n.note_type === filter);

  return (
    <div className="page-container" style={{paddingTop:'var(--space-8)', paddingBottom:'var(--space-16)'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--space-6)'}}>
        <div>
          <Link to={`/trips/${tripId}`} style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)'}}>← Back to Trip</Link>
          <h1 className="page-title" style={{marginTop:'var(--space-2)'}}>Trip Notes</h1>
        </div>
        <button className="btn-primary" onClick={() => { setEditNote(null); setForm({ title:'', content:'', noteType:'general' }); setShowModal(true); }}>+ Add Note</button>
      </div>

      <div style={{display:'flex', gap:'var(--space-2)', flexWrap:'wrap', marginBottom:'var(--space-6)'}}>
        <button className={`badge ${filter === 'all' ? 'badge-upcoming' : ''}`} style={{cursor:'pointer', border:'1px solid var(--color-border)'}} onClick={() => setFilter('all')}>All ({notes.length})</button>
        {NOTE_TYPES.map(t => (
          <button key={t} className={`badge ${filter === t ? 'badge-upcoming' : ''}`} style={{cursor:'pointer', border:'1px solid var(--color-border)'}} onClick={() => setFilter(t)}>
            {NOTE_ICONS[t]} {t}
          </button>
        ))}
      </div>

      {loading ? <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'var(--space-4)'}}>
        {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{height:160, borderRadius:'var(--radius-lg)'}} />)}
      </div> : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">📓</div><h3 className="empty-state-title">No notes yet</h3><p className="empty-state-text">Add hotel info, reminders, contacts, and more.</p><button className="btn-primary" onClick={() => setShowModal(true)}>Add First Note</button></div>
      ) : (
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'var(--space-4)'}}>
          {filtered.map(note => (
            <div key={note.id} className="card" style={{padding:'var(--space-4)', cursor:'pointer'}} onClick={() => setViewNote(note)}>
              <div style={{display:'flex', alignItems:'center', gap:'var(--space-2)', marginBottom:'var(--space-2)'}}>
                <span>{NOTE_ICONS[note.note_type]}</span>
                <span className="badge badge-upcoming" style={{fontSize:10}}>{note.note_type}</span>
                <span style={{marginLeft:'auto', fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)'}}>{formatDate(note.created_at)}</span>
              </div>
              {note.title && <h3 style={{fontWeight:'var(--font-weight-semibold)', marginBottom:'var(--space-2)', color:'var(--color-text-primary)'}}>{note.title}</h3>}
              <p style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-muted)', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical'}}>{note.content}</p>
              <div style={{display:'flex', gap:'var(--space-2)', marginTop:'var(--space-3)'}} onClick={e => e.stopPropagation()}>
                <button className="btn-ghost" style={{padding:'4px 8px', fontSize:'var(--font-size-xs)'}} onClick={() => { setEditNote(note); setForm({ title:note.title||'', content:note.content, noteType:note.note_type }); setShowModal(true); }}>✏️ Edit</button>
                <button className="btn-ghost" style={{padding:'4px 8px', fontSize:'var(--font-size-xs)', color:'var(--color-error)'}} onClick={() => deleteNote(note.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editNote ? 'Edit Note' : 'Add Note'}</h3>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="input-label">Note Type</label>
                <select className="input-field" value={form.noteType} onChange={e => setForm({...form, noteType:e.target.value})}>
                  {NOTE_TYPES.map(t => <option key={t} value={t}>{NOTE_ICONS[t]} {t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Title (Optional)</label>
                <input className="input-field" placeholder="Note title..." value={form.title} onChange={e => setForm({...form, title:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="input-label">Content *</label>
                <textarea className="input-field" rows={6} placeholder="Write your note here..." value={form.content} onChange={e => setForm({...form, content:e.target.value})} style={{resize:'vertical'}} autoFocus />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveNote}>{editNote ? 'Update Note' : 'Save Note'}</button>
            </div>
          </div>
        </div>
      )}

      {viewNote && (
        <div className="modal-overlay" onClick={() => setViewNote(null)}>
          <div className="modal" style={{maxWidth:640}} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{display:'flex', alignItems:'center', gap:'var(--space-2)'}}>
                <span>{NOTE_ICONS[viewNote.note_type]}</span>
                <h3 className="modal-title">{viewNote.title || 'Note'}</h3>
              </div>
              <button className="btn-ghost" onClick={() => setViewNote(null)}>✕</button>
            </div>
            <div className="modal-body" style={{whiteSpace:'pre-wrap', lineHeight:'var(--line-height-relaxed)'}}>{viewNote.content}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripNotes;
