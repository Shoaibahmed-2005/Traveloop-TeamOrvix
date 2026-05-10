import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tripAPI } from '../../api/tripAPI.js';
import { daysBetween } from '../../utils/formatDate.js';
import { getCurrencySymbol } from '../../utils/formatCurrency.js';
import { useAuth } from '../../context/AuthContext.jsx';

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #f4f7fb 0%, #e8f4f8 100%)',
    paddingTop: 80,
    paddingBottom: 60,
  },
  container: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '0 24px',
  },
  heroBar: {
    background: 'linear-gradient(135deg, #0a192f 0%, #14b8a6 100%)',
    borderRadius: 20,
    padding: '40px 48px',
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 8,
    letterSpacing: '-0.5px',
  },
  heroSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.6,
  },
  heroDeco: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    pointerEvents: 'none',
  },
  heroDeco2: {
    position: 'absolute',
    right: 60,
    bottom: -40,
    width: 140,
    height: 140,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
    pointerEvents: 'none',
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    boxShadow: '0 8px 40px rgba(10,25,47,0.10)',
    border: '1px solid #e2e8f0',
    padding: '40px 48px',
  },
  section: {
    marginBottom: 28,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 700,
    color: '#0a192f',
    marginBottom: 8,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '13px 16px',
    border: '1.5px solid #cbd5e1',
    borderRadius: 12,
    fontSize: 15,
    color: '#0a192f',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  inputFocused: {
    borderColor: '#14b8a6',
    boxShadow: '0 0 0 3px rgba(20,184,166,0.12)',
    background: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
    boxShadow: '0 0 0 3px rgba(239,68,68,0.10)',
  },
  textarea: {
    width: '100%',
    padding: '13px 16px',
    border: '1.5px solid #cbd5e1',
    borderRadius: 12,
    fontSize: 15,
    color: '#0a192f',
    background: '#f8fafc',
    outline: 'none',
    resize: 'vertical',
    minHeight: 100,
    boxSizing: 'border-box',
    fontFamily: 'Inter, system-ui, sans-serif',
    lineHeight: 1.6,
  },
  dateInput: {
    width: '100%',
    padding: '13px 16px',
    border: '1.5px solid #cbd5e1',
    borderRadius: 12,
    fontSize: 15,
    color: '#0a192f',
    background: '#f8fafc',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Inter, system-ui, sans-serif',
    colorScheme: 'light',
    cursor: 'pointer',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  errorText: {
    display: 'block',
    fontSize: 12,
    color: '#ef4444',
    marginTop: 5,
    fontWeight: 500,
  },
  durationBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'linear-gradient(135deg, rgba(20,184,166,0.10), rgba(20,184,166,0.06))',
    border: '1px solid rgba(20,184,166,0.25)',
    color: '#0d9488',
    borderRadius: 999,
    padding: '6px 16px',
    fontSize: 13,
    fontWeight: 600,
    marginTop: -8,
    marginBottom: 16,
  },
  budgetWrap: {
    position: 'relative',
  },
  budgetPrefix: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    fontWeight: 700,
    fontSize: 16,
    pointerEvents: 'none',
  },
  budgetInput: {
    paddingLeft: 34,
  },
  divider: {
    height: 1,
    background: '#e2e8f0',
    margin: '28px 0',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    cursor: 'pointer',
  },
  toggleTrack: (on) => ({
    width: 46,
    height: 26,
    borderRadius: 999,
    background: on ? 'linear-gradient(135deg,#0a192f,#14b8a6)' : '#cbd5e1',
    position: 'relative',
    transition: 'background 0.25s',
    flexShrink: 0,
  }),
  toggleThumb: (on) => ({
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: 3,
    left: on ? 23 : 3,
    transition: 'left 0.25s',
    boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
  }),
  toggleLabel: {
    fontSize: 15,
    fontWeight: 500,
    color: '#334155',
  },
  toggleHint: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  btnRow: {
    display: 'flex',
    gap: 14,
    marginTop: 32,
  },
  btnCancel: {
    padding: '13px 28px',
    border: '2px solid #0a192f',
    borderRadius: 12,
    background: 'transparent',
    color: '#0a192f',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnSubmit: {
    flex: 1,
    padding: '13px 28px',
    border: 'none',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #0a192f 0%, #14b8a6 100%)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(20,184,166,0.30)',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    letterSpacing: 0.2,
  },
};

const Field = ({ label, error, children }) => (
  <div style={s.section}>
    <label style={s.label}>{label}</label>
    {children}
    {error && <span style={s.errorText}>{error}</span>}
  </div>
);

const CreateTrip = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currencySymbol = getCurrencySymbol(user?.country);
  const currencyName = user?.country ? `(${user.country})` : '(USD)';
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '', totalBudget: '', isPublic: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

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
      const { data } = await tripAPI.createTrip({
        title: form.title,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        totalBudget: form.totalBudget ? parseFloat(form.totalBudget) : 0,
        isPublic: form.isPublic,
      });
      toast.success('Trip created! Now build your itinerary.');
      navigate(`/trips/${data.data.id}/builder`);
    } catch (err) {
      const errs = err.response?.data?.errors;
      if (errs) { const fe = {}; errs.forEach(e => fe[e.field] = e.message); setErrors(fe); }
      else toast.error('Failed to create trip');
    } finally { setLoading(false); }
  };

  const inputStyle = (name) => ({
    ...s.input,
    ...(focused === name ? s.inputFocused : {}),
    ...(errors[name] ? s.inputError : {}),
  });

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* Hero Banner */}
        <div style={s.heroBar}>
          <div style={s.heroDeco} />
          <div style={s.heroDeco2} />
          <div style={{ fontSize: 28, marginBottom: 12 }}>✈</div>
          <h1 style={s.heroTitle}>Plan a New Trip</h1>
          <p style={s.heroSub}>Fill in the details below to kick off your adventure.</p>
        </div>

        {/* Form Card */}
        <div style={s.card}>
          <form onSubmit={handleSubmit}>

            <Field label="Trip Title *" error={errors.title}>
              <input
                style={inputStyle('title')}
                placeholder="e.g. Rajasthan Heritage Tour 2026"
                value={form.title}
                onFocus={() => setFocused('title')}
                onBlur={() => setFocused('')}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </Field>

            <Field label="Description (optional)" error={null}>
              <textarea
                style={{ ...s.textarea, ...(focused === 'desc' ? s.inputFocused : {}) }}
                placeholder="Brief description of your trip — places to visit, theme, vibe..."
                value={form.description}
                onFocus={() => setFocused('desc')}
                onBlur={() => setFocused('')}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </Field>

            <div style={s.grid2}>
              <Field label="Start Date *" error={errors.startDate}>
                <input
                  style={{ ...s.dateInput, ...(errors.startDate ? s.inputError : {}) }}
                  type="date"
                  min={today}
                  value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                />
              </Field>
              <Field label="End Date *" error={errors.endDate}>
                <input
                  style={{ ...s.dateInput, ...(errors.endDate ? s.inputError : {}) }}
                  type="date"
                  min={form.startDate || today}
                  value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })}
                />
              </Field>
            </div>

            {duration > 0 && (
              <div style={s.durationBadge}>
                <span>📅</span>
                <span>Trip Duration: <strong>{duration} {duration === 1 ? 'day' : 'days'}</strong></span>
              </div>
            )}

            <Field label={`Total Budget ${currencyName}`} error={errors.totalBudget}>
              <div style={s.budgetWrap}>
                <span style={s.budgetPrefix}>{currencySymbol}</span>
                <input
                  style={{ ...inputStyle('budget'), ...s.budgetInput }}
                  type="number"
                  min="0"
                  placeholder="50000"
                  value={form.totalBudget}
                  onFocus={() => setFocused('budget')}
                  onBlur={() => setFocused('')}
                  onChange={e => setForm({ ...form, totalBudget: e.target.value })}
                />
              </div>
            </Field>

            <div style={s.divider} />

            <div style={s.toggleRow} onClick={() => setForm({ ...form, isPublic: !form.isPublic })}>
              <div style={s.toggleTrack(form.isPublic)}>
                <div style={s.toggleThumb(form.isPublic)} />
              </div>
              <div>
                <div style={s.toggleLabel}>Make trip public</div>
                <div style={s.toggleHint}>Share with the Traveloop community for inspiration</div>
              </div>
            </div>

            <div style={s.btnRow}>
              <button
                type="button"
                style={s.btnCancel}
                onClick={() => navigate('/trips')}
                onMouseEnter={e => { e.currentTarget.style.background = '#0a192f'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0a192f'; }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...s.btnSubmit, opacity: loading ? 0.75 : 1 }}
                disabled={loading}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
              >
                {loading ? (
                  <>
                    <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Creating...
                  </>
                ) : 'Save & Build Itinerary →'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default CreateTrip;
