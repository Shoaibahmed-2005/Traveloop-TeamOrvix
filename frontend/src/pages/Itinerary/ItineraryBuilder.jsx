import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { itineraryAPI } from '../../api/itineraryAPI.js';
import { cityAPI } from '../../api/cityAPI.js';
import { tripAPI } from '../../api/tripAPI.js';
import { formatDateRange } from '../../utils/formatDate.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import './ItineraryBuilder.css';

const SECTION_TYPES = [
  { value:'hotel', icon:'🏨', label:'Hotel' },
  { value:'transport', icon:'🚂', label:'Transport' },
  { value:'activity', icon:'🎯', label:'Activity' },
  { value:'meal', icon:'🍽️', label:'Meal' },
  { value:'other', icon:'📌', label:'Other' },
];

const ItineraryBuilder = () => {
  const { id: tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [sections, setSections] = useState([]);
  const [showAddStop, setShowAddStop] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [stopForm, setStopForm] = useState({ cityId:'', arrivalDate:'', departureDate:'' });
  const [sectionForm, setSectionForm] = useState({ title:'', sectionType:'activity', description:'', startDate:'', endDate:'', estimatedCost:'' });
  const [editSection, setEditSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(citySearch, 300);

  useEffect(() => {
    Promise.all([tripAPI.getTrip(tripId), itineraryAPI.getStops(tripId)])
      .then(([tripRes, stopsRes]) => {
        setTrip(tripRes.data.data);
        setStops(stopsRes.data.data);
        if (stopsRes.data.data.length > 0) setSelectedStop(stopsRes.data.data[0]);
      }).finally(() => setLoading(false));
  }, [tripId]);

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      cityAPI.getCities({ search: debouncedSearch }).then(r => setCityResults(r.data.data.slice(0, 8)));
    } else setCityResults([]);
  }, [debouncedSearch]);

  useEffect(() => {
    if (selectedStop) {
      itineraryAPI.getSections(tripId, selectedStop.id).then(r => setSections(r.data.data));
    }
  }, [selectedStop, tripId]);

  const handleAddStop = async () => {
    if (!stopForm.cityId || !stopForm.arrivalDate || !stopForm.departureDate) { toast.error('All stop fields required'); return; }
    try {
      const { data } = await itineraryAPI.addStop(tripId, stopForm);
      const cityData = cityResults.find(c => c.id === parseInt(stopForm.cityId)) || selectedCity;
      const newStop = { ...data.data, city_name: cityData?.name, country: cityData?.country };
      setStops(prev => [...prev, newStop]);
      setSelectedStop(newStop);
      setShowAddStop(false);
      setStopForm({ cityId:'', arrivalDate:'', departureDate:'' });
      setSelectedCity(null);
      setCitySearch('');
      toast.success('Stop added!');
    } catch { toast.error('Failed to add stop'); }
  };

  const handleDeleteStop = async (stopId) => {
    try {
      await itineraryAPI.deleteStop(tripId, stopId);
      const updated = stops.filter(s => s.id !== stopId);
      setStops(updated);
      if (selectedStop?.id === stopId) setSelectedStop(updated[0] || null);
      toast.success('Stop removed');
    } catch { toast.error('Failed to remove stop'); }
  };

  const handleAddSection = async () => {
    if (!sectionForm.title) { toast.error('Section title required'); return; }
    try {
      if (editSection) {
        const { data } = await itineraryAPI.updateSection(tripId, selectedStop.id, editSection.id, { title:sectionForm.title, sectionType:sectionForm.sectionType, description:sectionForm.description, startDate:sectionForm.startDate||null, endDate:sectionForm.endDate||null, estimatedCost:parseFloat(sectionForm.estimatedCost)||0 });
        setSections(prev => prev.map(s => s.id === editSection.id ? data.data : s));
        setEditSection(null);
        toast.success('Section updated');
      } else {
        const { data } = await itineraryAPI.addSection(tripId, selectedStop.id, { title:sectionForm.title, sectionType:sectionForm.sectionType, description:sectionForm.description, startDate:sectionForm.startDate||null, endDate:sectionForm.endDate||null, estimatedCost:parseFloat(sectionForm.estimatedCost)||0 });
        setSections(prev => [...prev, data.data]);
        toast.success('Section added!');
      }
      setSectionForm({ title:'', sectionType:'activity', description:'', startDate:'', endDate:'', estimatedCost:'' });
      setShowAddSection(false);
    } catch { toast.error('Failed to save section'); }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await itineraryAPI.deleteSection(tripId, selectedStop.id, sectionId);
      setSections(prev => prev.filter(s => s.id !== sectionId));
      toast.success('Section deleted');
    } catch { toast.error('Failed to delete section'); }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(stops);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    const withOrder = reordered.map((s, i) => ({ ...s, stop_order: i + 1 }));
    setStops(withOrder);
    try { await itineraryAPI.reorderStops(tripId, withOrder.map(s => ({ id: s.id, stop_order: s.stop_order }))); }
    catch { toast.error('Failed to reorder stops'); }
  };

  const totalEstimated = sections.reduce((sum, s) => sum + parseFloat(s.estimated_cost || 0), 0);
  const sectionTypeIcon = (type) => SECTION_TYPES.find(t => t.value === type)?.icon || '📌';

  if (loading) return <div className="page-container" style={{paddingTop:'var(--space-10)'}}>
    <div className="skeleton" style={{height:60, borderRadius:'var(--radius-md)', marginBottom:'var(--space-4)'}} />
    <div style={{display:'flex', gap:'var(--space-5)'}}>
      <div className="skeleton" style={{width:280, height:400, borderRadius:'var(--radius-lg)'}} />
      <div className="skeleton" style={{flex:1, height:400, borderRadius:'var(--radius-lg)'}} />
    </div>
  </div>;

  return (
    <div className="builder-wrap">
      <div className="builder-topbar">
        <Link to={`/trips/${tripId}`} className="back-link-dark">← {trip?.title || 'Trip'}</Link>
        <h1 className="builder-title">Itinerary Builder</h1>
        <Link to={`/trips/${tripId}/itinerary`} className="btn-primary btn-sm-text">View Itinerary →</Link>
      </div>
      <div className="builder-layout">
        {/* Sidebar */}
        <div className="builder-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Trip Stops</h2>
            <button className="btn-primary btn-sm-icon" onClick={() => setShowAddStop(true)}>+</button>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="stops">
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="stops-droppable">
                  {stops.length === 0 ? (
                    <div className="stops-empty">
                      <p>No stops yet</p>
                      <button className="btn-secondary" style={{marginTop:'var(--space-3)'}} onClick={() => setShowAddStop(true)}>Add First Stop</button>
                    </div>
                  ) : stops.map((stop, index) => (
                    <Draggable key={stop.id} draggableId={String(stop.id)} index={index}>
                      {(prov, snap) => (
                        <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                          className={`stop-item-card ${selectedStop?.id === stop.id ? 'active' : ''} ${snap.isDragging ? 'dragging' : ''}`}
                          onClick={() => setSelectedStop(stop)}>
                          <span className="drag-handle">⋮⋮</span>
                          <div className="stop-item-info">
                            <div className="stop-item-city">{stop.city_name || 'Unknown City'}</div>
                            <div className="stop-item-dates">{formatDateRange(stop.arrival_date, stop.departure_date)}</div>
                          </div>
                          <button className="stop-del-btn" onClick={e => { e.stopPropagation(); handleDeleteStop(stop.id); }}>✕</button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Main Content */}
        <div className="builder-main">
          {!selectedStop ? (
            <div className="empty-state" style={{height:'100%', minHeight:400}}>
              <div className="empty-state-icon">🗺️</div>
              <h3 className="empty-state-title">Add your first stop</h3>
              <p className="empty-state-text">Click the + button in the sidebar to add a destination to your trip.</p>
            </div>
          ) : (
            <>
              <div className="main-stop-header">
                <div>
                  <h2 className="main-stop-city">{selectedStop.city_name}</h2>
                  <p className="main-stop-dates">{formatDateRange(selectedStop.arrival_date, selectedStop.departure_date)}</p>
                </div>
                <button className="btn-primary" onClick={() => { setShowAddSection(true); setEditSection(null); setSectionForm({ title:'', sectionType:'activity', description:'', startDate:'', endDate:'', estimatedCost:'' }); }}>+ Add Section</button>
              </div>
              {sections.length === 0 ? (
                <div className="empty-state" style={{minHeight:300}}>
                  <div className="empty-state-icon">📋</div>
                  <h3 className="empty-state-title">No sections yet</h3>
                  <p className="empty-state-text">Add hotels, activities, transport and meals to this stop.</p>
                </div>
              ) : (
                <div className="sections-list">
                  {sections.map(section => (
                    <div key={section.id} className="section-card card">
                      <div className="section-card-header">
                        <div className="section-type-icon">{sectionTypeIcon(section.section_type)}</div>
                        <div className="section-card-info">
                          <div className="section-card-title">{section.title}</div>
                          {section.start_date && <div className="section-card-dates">{formatDateRange(section.start_date, section.end_date)}</div>}
                        </div>
                        {section.estimated_cost > 0 && <span className="section-cost">{formatCurrency(section.estimated_cost)}</span>}
                        <div className="section-actions">
                          <button className="btn-ghost" onClick={() => { setEditSection(section); setSectionForm({ title:section.title, sectionType:section.section_type, description:section.description||'', startDate:section.start_date?.split('T')[0]||'', endDate:section.end_date?.split('T')[0]||'', estimatedCost:section.estimated_cost||'' }); setShowAddSection(true); }}>✏️</button>
                          <button className="btn-ghost" style={{color:'var(--color-error)'}} onClick={() => handleDeleteSection(section.id)}>🗑️</button>
                        </div>
                      </div>
                      {section.description && <p className="section-card-desc">{section.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      {selectedStop && (
        <div className="builder-bottom-bar">
          <span>✈️ <strong>{selectedStop.city_name}</strong> — Estimated: <strong>{formatCurrency(totalEstimated)}</strong></span>
          {trip?.total_budget > 0 && <span style={{color:'var(--color-text-muted)'}}>of {formatCurrency(trip.total_budget)} budget</span>}
          <Link to={`/trips/${tripId}/itinerary`} className="btn-primary">View Full Itinerary</Link>
        </div>
      )}

      {/* Add Stop Modal */}
      {showAddStop && (
        <div className="modal-overlay" onClick={() => setShowAddStop(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Trip Stop</h3>
              <button className="btn-ghost" onClick={() => setShowAddStop(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="input-label">Search City *</label>
                <input className="input-field" placeholder="Start typing a city name..." value={citySearch} onChange={e => setCitySearch(e.target.value)} autoFocus />
                {cityResults.length > 0 && (
                  <div className="city-dropdown">
                    {cityResults.map(city => (
                      <button key={city.id} className="city-dropdown-item" onClick={() => { setSelectedCity(city); setStopForm({...stopForm, cityId: city.id}); setCitySearch(`${city.name}, ${city.country}`); setCityResults([]); }}>
                        <strong>{city.name}</strong><span>, {city.country}</span><span className="city-region">{city.region}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="input-label">Arrival Date *</label>
                  <input className="input-field" type="date" value={stopForm.arrivalDate} onChange={e => setStopForm({...stopForm, arrivalDate:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="input-label">Departure Date *</label>
                  <input className="input-field" type="date" min={stopForm.arrivalDate} value={stopForm.departureDate} onChange={e => setStopForm({...stopForm, departureDate:e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddStop(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddStop}>Add Stop</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Section Modal */}
      {showAddSection && (
        <div className="modal-overlay" onClick={() => setShowAddSection(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editSection ? 'Edit Section' : 'Add Section'}</h3>
              <button className="btn-ghost" onClick={() => { setShowAddSection(false); setEditSection(null); }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="input-label">Section Type</label>
                <div className="section-type-grid">
                  {SECTION_TYPES.map(t => (
                    <button key={t.value} type="button" className={`section-type-btn ${sectionForm.sectionType === t.value ? 'active' : ''}`} onClick={() => setSectionForm({...sectionForm, sectionType:t.value})}>
                      <span>{t.icon}</span><span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="input-label">Title *</label>
                <input className="input-field" placeholder="e.g. Grand Palace Visit" value={sectionForm.title} onChange={e => setSectionForm({...sectionForm, title:e.target.value})} autoFocus />
              </div>
              <div className="form-group">
                <label className="input-label">Description</label>
                <textarea className="input-field" rows={3} placeholder="Optional details..." value={sectionForm.description} onChange={e => setSectionForm({...sectionForm, description:e.target.value})} style={{resize:'vertical'}} />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="input-label">Start Date</label>
                  <input className="input-field" type="date" value={sectionForm.startDate} onChange={e => setSectionForm({...sectionForm, startDate:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="input-label">End Date</label>
                  <input className="input-field" type="date" value={sectionForm.endDate} onChange={e => setSectionForm({...sectionForm, endDate:e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="input-label">Estimated Cost (USD)</label>
                <div className="budget-input-wrap">
                  <span className="budget-prefix">$</span>
                  <input className="input-field" type="number" min="0" placeholder="0" value={sectionForm.estimatedCost} onChange={e => setSectionForm({...sectionForm, estimatedCost:e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => { setShowAddSection(false); setEditSection(null); }}>Cancel</button>
              <button className="btn-primary" onClick={handleAddSection}>{editSection ? 'Update' : 'Add Section'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryBuilder;
