import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('ErrorBoundary caught:', error, info); }
  render() {
    if (this.state.hasError) return (
      <div className="empty-state" style={{ height: '100vh' }}>
        <div className="empty-state-icon">⚠️</div>
        <h2 className="empty-state-title">Something went wrong</h2>
        <p className="empty-state-text">{this.state.error?.message}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
    return this.props.children;
  }
}

export default ErrorBoundary;
