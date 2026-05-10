import { createContext, useContext, useState, useCallback } from 'react';
import { tripAPI } from '../api/tripAPI.js';

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await tripAPI.getTrips();
      setTrips(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTrip = (id) => setTrips(prev => prev.filter(t => t.id !== id));
  const addTrip = (trip) => setTrips(prev => [trip, ...prev]);
  const updateTripInList = (updated) => setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));

  return (
    <TripContext.Provider value={{ trips, loading, fetchTrips, removeTrip, addTrip, updateTripInList }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => useContext(TripContext);
export default TripContext;
