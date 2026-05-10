import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext.jsx';
import './Login.css';

const SLIDES = ['/city1.jpg', '/city2.jpg', '/city3.jpg', '/city4.jpg', '/city5.jpg'];

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
    <div className="login-page">
      {/* True full-image slideshow using real <img> elements */}
      <div className="login-bg">
        <div className="cinema-slider-track">
          {[...SLIDES, SLIDES[0]].map((src, i) => (
            <img key={i} src={src} alt="" className="cinema-slide-img" />
          ))}
        </div>
      </div>
      
      {/* Left — hero content, vertically centered */}
      <div className="hero-content">
        <div className="login-logo-wrapper">
          <Link to="/">
            <div className="login-logo-pill">
              <img src="/logo.png" alt="Traveloop" />
            </div>
          </Link>
        </div>
        <span className="hero-badge">✈️ World's Travel Planner</span>
        <h1 className="hero-heading">
          <span className="white">Dream it.<br />Plan it.</span>
          <span className="teal">Live it.</span>
        </h1>
        <p className="hero-subtitle">
          Seamlessly plan multi-city trips across the world's most 
          iconic destinations. Modern travel, reimagined for you.
        </p>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Trips Planned</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">120+</span>
            <span className="stat-label">Cities Covered</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Happy Travelers</span>
          </div>
        </div>
        <div className="city-pills">
          {['Paris', 'Tokyo', 'Bali', 'New York', 'Dubai', 'Rome', 'Goa', 'Jaipur'].map(city => (
            <span key={city} className="city-pill">{city}</span>
          ))}
        </div>
      </div>

      {/* Right — login card, vertically centered */}
      <div className="login-card">
        <h2 className="login-card-title">Welcome Back</h2>
        <p className="login-card-subtitle">Sign in to continue planning your adventures</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className={errors.email ? 'error' : ''} 
              placeholder="arjun@example.com"
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })}
              onBlur={() => { const e = validate(); setErrors(p => ({ ...p, email: e.email })); }} 
            />
            {errors.email && <span className="login-error-text">{errors.email}</span>}
          </div>

          <div className="login-input-group">
            <label>Password</label>
            <div className="login-pwd-wrap">
              <input 
                type={showPwd ? 'text' : 'password'} 
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password" 
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onBlur={() => { const e = validate(); setErrors(p => ({ ...p, password: e.password })); }} 
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="login-error-text">{errors.password}</span>}
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="login-signup-link">
          New to Traveloop? <Link to="/register">Create Free Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
