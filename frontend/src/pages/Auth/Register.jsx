import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext.jsx';
import './Auth.css';

const SLIDES = [
  { src: '/city5.jpg' }, { src: '/city1.jpg' }, { src: '/city2.jpg' },
  { src: '/city3.jpg' }, { src: '/city4.jpg' },
];

// Country codes list
const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
];

// Indian cities
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
  'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot',
  'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad',
  'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada',
  'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur',
  'Hubli', 'Tiruchirappalli', 'Bareilly', 'Mysore', 'Dehradun', 'Goa',
  'Udaipur', 'Shimla', 'Manali', 'Ooty', 'Munnar', 'Leh', 'Gangtok',
];

// World countries
const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'United Arab Emirates', 'Singapore', 'Malaysia', 'Germany', 'France',
  'Japan', 'China', 'Brazil', 'South Africa', 'Pakistan', 'Bangladesh',
  'Sri Lanka', 'Nepal', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain',
  'Oman', 'New Zealand', 'Netherlands', 'Italy', 'Spain', 'Sweden',
  'Norway', 'Denmark', 'Switzerland', 'Belgium', 'Austria', 'Portugal',
  'Russia', 'South Korea', 'Thailand', 'Indonesia', 'Philippines', 'Vietnam',
  'Mexico', 'Argentina', 'Colombia', 'Egypt', 'Kenya', 'Nigeria', 'Ghana',
  'Tanzania', 'Ethiopia', 'Israel', 'Turkey', 'Greece', 'Poland', 'Ukraine',
];

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
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    countryCode: '+91', phone: '', city: '', country: 'India',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const pwdStrength = getPasswordStrength(form.password);

  const filteredCities = INDIAN_CITIES.filter(c =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 8);

  const validate = () => {
    const e = {};
    if (!form.firstName || form.firstName.length < 2) e.firstName = 'At least 2 characters';
    if (!form.lastName || form.lastName.length < 2) e.lastName = 'At least 2 characters';
    
    if (!form.email) {
      e.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Invalid email format';
    }
    
    if (!form.password) {
      e.password = 'Password is required';
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters long';
    } else if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      e.password = 'Must contain at least one uppercase letter and one number';
    }
    
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.country) e.country = 'Please select a country';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    const fullPhone = form.phone ? `${form.countryCode} ${form.phone}` : '';
    try {
      await register({
        firstName: form.firstName, lastName: form.lastName,
        email: form.email, password: form.password,
        phone: fullPhone || undefined,
        city: form.city || undefined,
        country: form.country || undefined,
      });
      toast.success('Welcome to Traveloop!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      const errs = err.response?.data?.errors;
      if (errs) { const fe = {}; errs.forEach(e => { fe[e.field] = e.message; }); setErrors(fe); }
      else toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-cinema-root">
      <div className="cinema-bg">
        {SLIDES.map((s, i) => (
          <div key={s.src + i} className="cinema-slide"
            style={{ backgroundImage: `url(${s.src})`, animationDelay: `${i * -8}s` }} />
        ))}
        <div className="cinema-overlay" />
        <div className="cinema-vignette" />
      </div>

      <div className="auth-cinema-content register-layout">
        <div className="auth-cinema-left register-left">
          <Link to="/"><img src="/logo.png" alt="Traveloop" className="cinema-logo" /></Link>
          <div className="cinema-badge">✦ START YOUR JOURNEY TODAY</div>
          <h1 className="cinema-headline">Join<br /><span className="cinema-teal">Traveloop</span></h1>
          <p className="cinema-subtext">
            From the snow-capped Himalayas to the golden shores of Kerala —
            plan your perfect adventure in minutes.
          </p>
          <div className="cinema-pills">
            {['Himalayas', 'Goa', 'Kerala', 'Rajasthan', 'Agra', 'Mumbai'].map(d => (
              <span key={d} className="cinema-pill">{d}</span>
            ))}
          </div>
          <div className="register-already">
            Already have an account? <Link to="/login" className="teal-text-link">Sign In →</Link>
          </div>
        </div>

        <div className="auth-cinema-right">
          <div className="auth-glass-card register-card">
            <h2 className="glass-heading">Create Account</h2>
            <p className="glass-subheading">Fill in your details to get started for free</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              {/* Name row */}
              <div className="reg-grid-2">
                <div className="glass-field-group">
                  <label>First Name *</label>
                  <input type="text" className={errors.firstName ? 'error' : ''} placeholder="Arjun"
                    value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                  {errors.firstName && <span className="glass-error">{errors.firstName}</span>}
                </div>
                <div className="glass-field-group">
                  <label>Last Name *</label>
                  <input type="text" className={errors.lastName ? 'error' : ''} placeholder="Sharma"
                    value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                  {errors.lastName && <span className="glass-error">{errors.lastName}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="glass-field-group">
                <label>Email Address *</label>
                <input type="email" className={errors.email ? 'error' : ''} placeholder="arjun@example.com"
                  value={form.email} 
                  onChange={e => setForm({ ...form, email: e.target.value })} 
                  onBlur={() => { const e = validate(); setErrors(p => ({ ...p, email: e.email })); }}
                />
                {errors.email && <span className="glass-error">{errors.email}</span>}
              </div>

              {/* Phone with country code */}
              <div className="glass-field-group">
                <label>Phone Number</label>
                <div className="phone-input-row">
                  <select
                    className="phone-code-select"
                    value={form.countryCode}
                    onChange={e => setForm({ ...form, countryCode: e.target.value })}
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} {c.country}
                      </option>
                    ))}
                  </select>
                  <input type="tel" className="phone-number-input" placeholder="98765 43210"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>

              {/* Password */}
              <div className="glass-field-group">
                <label>Password *</label>
                <div className="pwd-wrap">
                  <input type={showPwd ? 'text' : 'password'} className={errors.password ? 'error' : ''}
                    placeholder="Min 8 chars, uppercase, number, special"
                    value={form.password} 
                    onChange={e => setForm({ ...form, password: e.target.value })} 
                    onBlur={() => { const e = validate(); setErrors(p => ({ ...p, password: e.password })); }}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}>{showPwd ? 'Hide' : 'Show'}</button>
                </div>
                {pwdStrength && (
                  <div className="pwd-strength-row">
                    <div className={`pwd-bar ${pwdStrength}`} />
                    <span className={`pwd-bar-label ${pwdStrength}`}>
                      {pwdStrength === 'weak' ? 'Weak' : pwdStrength === 'medium' ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                )}
                {errors.password && <span className="glass-error">{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="glass-field-group">
                <label>Confirm Password *</label>
                <input type="password" className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Repeat password"
                  value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                {errors.confirmPassword && <span className="glass-error">{errors.confirmPassword}</span>}
              </div>

              {/* City — searchable dropdown */}
              <div className="glass-field-group" style={{ position: 'relative' }}>
                <label>City</label>
                <input
                  type="text"
                  placeholder="Search city..."
                  value={citySearch || form.city}
                  onFocus={() => { setCitySearch(''); setShowCityDropdown(true); }}
                  onChange={e => { setCitySearch(e.target.value); setForm({ ...form, city: '' }); setShowCityDropdown(true); }}
                  onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
                  autoComplete="off"
                />
                {showCityDropdown && filteredCities.length > 0 && (
                  <div className="glass-dropdown">
                    {filteredCities.map(city => (
                      <div key={city} className="glass-dropdown-item"
                        onMouseDown={() => { setForm({ ...form, city }); setCitySearch(''); setShowCityDropdown(false); }}>
                        📍 {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Country — dropdown */}
              <div className="glass-field-group">
                <label>Country *</label>
                <select
                  className={`glass-select ${errors.country ? 'error' : ''}`}
                  value={form.country}
                  onChange={e => setForm({ ...form, country: e.target.value })}
                >
                  <option value="">Select country...</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.country && <span className="glass-error">{errors.country}</span>}
              </div>

              <button type="submit" className="btn-teal-large" disabled={loading} style={{ marginTop: '8px' }}>
                {loading ? <><span className="btn-spinner" /> Creating account...</> : 'Create My Account →'}
              </button>
            </form>

            <div className="auth-footer-flat" style={{ marginTop: '20px' }}>
              Already have an account?&nbsp;
              <Link to="/login" className="teal-text-link">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
