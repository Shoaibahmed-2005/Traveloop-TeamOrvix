import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext.jsx';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <Link to="/"><img src="/logo.png" alt="Traveloop" height="80" className="auth-logo" onError={e => { e.target.style.display='none'; }} /></Link>
        <h1 className="auth-hero-title">Dream it.<br/>Plan it.<br/>Live it.</h1>
        <p className="auth-hero-sub">Your personalized travel planner for unforgettable adventures across India and beyond.</p>
        <div className="auth-features">
          <div className="auth-feature-item"><span className="auth-feature-dot" /> Plan multi-city trips with ease</div>
          <div className="auth-feature-item"><span className="auth-feature-dot" /> Track budgets in real-time</div>
          <div className="auth-feature-item"><span className="auth-feature-dot" /> Share itineraries with the community</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-card">
          <h2 className="auth-form-title">Welcome Back</h2>
          <p className="auth-form-sub">Sign in to continue planning your adventures</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="input-label">Email Address</label>
              <input className={`input-field ${errors.email ? 'error' : ''}`} type="email" placeholder="arjun@example.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} onBlur={() => { const e = validate(); setErrors(prev => ({...prev, email: e.email})); }} />
              {errors.email && <span className="input-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="input-label">Password</label>
              <div className="input-pwd-wrap">
                <input className={`input-field ${errors.password ? 'error' : ''}`} type={showPwd ? 'text' : 'password'} placeholder="Enter your password" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})} onBlur={() => { const e = validate(); setErrors(prev => ({...prev, password: e.password})); }} />
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>{showPwd ? '◉' : '◎'}</button>
              </div>
              {errors.password && <span className="input-error">{errors.password}</span>}
            </div>
            <button type="submit" className="btn-primary auth-btn" disabled={loading}>
              {loading ? <><div className="spinner" />&nbsp;Signing in...</> : 'Sign In →'}
            </button>
          </form>
          <div className="auth-divider"><span>New to Traveloop?</span></div>
          <Link to="/register" className="btn-secondary auth-btn" style={{textAlign:'center',justifyContent:'center'}}>Create Free Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
