import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tripAPI } from '../../api/tripAPI.js';
import { daysBetween } from '../../utils/formatDate.js';
import './Trips.css';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', startDate:'', endDate:'', totalBudget:'', isPublic:false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const duration = form.startDate && form.endDate ? daysBetween(form.startDate, form.endDate) : 0;

  const validate = () => {
    const e = {};
    if (!form.title || form.title.length < 3) e.title = 'Title must be at least 3 characters';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.endDate) e.endDate = 'End date is required';
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) e.endDate = 'End date must be after start date';
    if (form.totalBudget && (isNaN(form.totalBudget) || parseFloat(form.totalBudget) < 0)) e.totalBudget = 'Budget must be a positive number';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const { data } = await tripAPI.createTrip({ title: form.title, description: form.description, startDate: form.startDate, endDate: form.endDate, totalBudget: form.totalBudget ? parseFloat(form.totalBudget) : 0, isPublic: form.isPublic });
      toast.success('Trip created! Now build your itinerary 🗺️');
      navigate(`/trips/${data.data.id}/builder`);
    } catch (err) {
      const errs = err.response?.data?.errors;
      if (errs) { const fe = {}; errs.forEach(e => fe[e.field] = e.message); setErrors(fe); }
      else toast.error('Failed to create trip');
    } finally { setLoading(false); }
  };

  return (
    <div className="create-trip-container">
      <div className="page-header">
        <h1 className="page-title">Plan a New Trip ✈️</h1>
        <p className="page-subtitle">Fill in the details to get started</p>
      </div>
      <div className="create-trip-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Trip Title *</label>
            <input className={`input-field ${errors.title ? 'error' : ''}`} placeholder="e.g. Southeast Asia Adventure 2026" value={form.title} onChange={e => setForm({...form, title:e.target.value})} />
            {errors.title && <span className="input-error">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label className="input-label">Description</label>
            <textarea className="input-field" rows={3} placeholder="Brief description of your trip..." value={form.description} onChange={e => setForm({...form, description:e.target.value})} style={{resize:'vertical'}} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="input-label">Start Date *</label>
              <input className={`input-field ${errors.startDate ? 'error' : ''}`} type="date" min={today} value={form.startDate} onChange={e => setForm({...form, startDate:e.target.value})} />
              {errors.startDate && <span className="input-error">{errors.startDate}</span>}
            </div>
            <div className="form-group">
              <label className="input-label">End Date *</label>
              <input className={`input-field ${errors.endDate ? 'error' : ''}`} type="date" min={form.startDate || today} value={form.endDate} onChange={e => setForm({...form, endDate:e.target.value})} />
              {errors.endDate && <span className="input-error">{errors.endDate}</span>}
            </div>
          </div>
          {duration > 0 && <div className="trip-duration-hint">🗓️ Trip Duration: {duration} days</div>}
          <div className="form-group" style={{marginTop:'var(--space-4)'}}>
            <label className="input-label">Total Budget (USD)</label>
            <div className="budget-input-wrap">
              <span className="budget-prefix">$</span>
              <input className={`input-field ${errors.totalBudget ? 'error' : ''}`} type="number" min="0" placeholder="3000" value={form.totalBudget} onChange={e => setForm({...form, totalBudget:e.target.value})} />
            </div>
            {errors.totalBudget && <span className="input-error">{errors.totalBudget}</span>}
          </div>
          <div className="form-group">
            <label className="toggle-switch" onClick={() => setForm({...form, isPublic:!form.isPublic})}>
              <div className={`toggle-knob ${form.isPublic ? 'on' : ''}`} />
              <span className="toggle-label">Make trip public (share with community)</span>
            </label>
          </div>
          <div style={{display:'flex', gap:'var(--space-3)', marginTop:'var(--space-6)'}}>
            <button type="button" className="btn-secondary" onClick={() => navigate('/trips')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{flex:1}}>
              {loading ? <><div className="spinner" /> Creating...</> : 'Save & Build Itinerary →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
