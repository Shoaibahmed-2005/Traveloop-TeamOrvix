const Loader = ({ count = 3, height = 120 }) => (
  <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton" style={{ height, borderRadius: 'var(--radius-lg)' }} />
    ))}
  </div>
);
export default Loader;
