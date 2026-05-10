import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext.jsx';
import './Auth.css';

const getPasswordStrength = (pwd) => {
  if (!pwd) return null;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score <= 1) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'', confirmPassword:'', phone:'', city:'', country:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const pwdStrength = getPasswordStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.firstName || form.firstName.length < 2) e.firstName = 'At least 2 characters';
    if (!form.lastName || form.lastName.length < 2) e.lastName = 'At least 2 characters';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 8) e.password = 'Min 8 chars with uppercase, number & special char';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, phone: form.phone, city: form.city, country: form.country });
      toast.success('Welcome to Traveloop!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      const errs = err.response?.data?.errors;
      if (errs) { const fieldErrs = {}; errs.forEach(e => { fieldErrs[e.field] = e.message; }); setErrors(fieldErrs); }
      else toast.error(msg);
    } finally { setLoading(false); }
  };

  const field = (key, label, type='text', placeholder='', required=false) => (
    <div className="form-group">
      <label className="input-label">{label}{required && ' *'}</label>
      <input className={`input-field ${errors[key] ? 'error' : ''}`} type={type} placeholder={placeholder} value={form[key]}
        onChange={e => setForm({...form, [key]: e.target.value})} />
      {errors[key] && <span className="input-error">{errors[key]}</span>}
    </div>
  );

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <Link to="/"><img src="/logo.png" alt="Traveloop" height="80" className="auth-logo" onError={e => { e.target.style.display='none'; }} /></Link>
        <h1 className="auth-hero-title">Join<br/>Traveloop</h1>
        <p className="auth-hero-sub">Start planning the trip of your lifetime — from the Himalayas to the backwaters.</p>
        <div className="auth-features">
          <div className="auth-feature-item"><span className="auth-feature-dot" /> Build multi-city itineraries</div>
          <div className="auth-feature-item"><span className="auth-feature-dot" /> Budget tracking & analytics</div>
          <div className="auth-feature-item"><span className="auth-feature-dot" /> Community trip sharing</div>
          <div className="auth-feature-item"><span className="auth-feature-dot" /> Packing checklists & notes</div>
        </div>
      </div>
      <div className="auth-right" style={{alignItems:'flex-start', overflowY:'auto'}}>
        <div className="auth-form-card" style={{margin:'var(--space-6) auto'}}>
          <h2 className="auth-form-title">Create Account</h2>
          <p className="auth-form-sub">Fill in your details to get started for free</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-grid-2">
              {field('firstName','First Name','text','Arjun',true)}
              {field('lastName','Last Name','text','Sharma',true)}
            </div>
            {field('email','Email Address','email','arjun@example.com',true)}
            {field('phone','Phone Number','tel','+91 98765 43210')}
            <div className="form-group">
              <label className="input-label">Password *</label>
              <div className="input-pwd-wrap">
                <input className={`input-field ${errors.password ? 'error' : ''}`} type={showPwd ? 'text' : 'password'} placeholder="Min 8 chars, uppercase, number, special" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})} />
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>{showPwd ? '◉' : '◎'}</button>
              </div>
              {pwdStrength && <><div className={`pwd-strength ${pwdStrength}`} /><div className={`pwd-strength-label ${pwdStrength}`}>{pwdStrength === 'weak' ? 'Weak password' : pwdStrength === 'medium' ? 'Medium strength' : 'Strong password'}</div></>}
              {errors.password && <span className="input-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="input-label">Confirm Password *</label>
              <input className={`input-field ${errors.confirmPassword ? 'error' : ''}`} type="password" placeholder="Repeat password" value={form.confirmPassword}
                onChange={e => setForm({...form, confirmPassword: e.target.value})} />
              {errors.confirmPassword && <span className="input-error">{errors.confirmPassword}</span>}
            </div>
            <div className="form-grid-2">
              {field('city','City','text','Mumbai')}
              {field('country','Country','text','India')}
            </div>
            <button type="submit" className="btn-primary auth-btn" disabled={loading} style={{marginTop:'var(--space-4)'}}>
              {loading ? <><div className="spinner" /> Creating account...</> : 'Create My Account →'}
            </button>
          </form>
          <div className="auth-divider"><span>Already have an account?</span></div>
          <Link to="/login" className="btn-secondary auth-btn" style={{textAlign:'center', justifyContent:'center'}}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
