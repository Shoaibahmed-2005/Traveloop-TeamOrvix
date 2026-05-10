import pool from '../config/db.js';

// STOPS
export const getStops = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT ts.*, c.name as city_name, c.country, c.region, c.image_url, c.cost_index
       FROM trip_stops ts LEFT JOIN cities c ON ts.city_id=c.id
       WHERE ts.trip_id=$1 ORDER BY ts.stop_order`,
      [req.params.tripId]
    );
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

export const addStop = async (req, res, next) => {
  try {
    const { cityId, arrivalDate, departureDate, notes } = req.body;
    const orderRes = await pool.query('SELECT COALESCE(MAX(stop_order),0)+1 AS next FROM trip_stops WHERE trip_id=$1', [req.params.tripId]);
    const stopOrder = orderRes.rows[0].next;
    const { rows } = await pool.query(
      `INSERT INTO trip_stops (trip_id, city_id, stop_order, arrival_date, departure_date, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.params.tripId, cityId, stopOrder, arrivalDate, departureDate, notes || null]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const updateStop = async (req, res, next) => {
  try {
    const { arrivalDate, departureDate, notes } = req.body;
    const { rows } = await pool.query(
      `UPDATE trip_stops SET arrival_date=$1, departure_date=$2, notes=$3
       WHERE id=$4 AND trip_id=$5 RETURNING *`,
      [arrivalDate, departureDate, notes || null, req.params.stopId, req.params.tripId]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Stop not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const deleteStop = async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM trip_stops WHERE id=$1 AND trip_id=$2', [req.params.stopId, req.params.tripId]);
    if (rowCount === 0) return res.status(404).json({ success: false, message: 'Stop not found' });
    res.json({ success: true, message: 'Stop deleted' });
  } catch (error) { next(error); }
};

export const reorderStops = async (req, res, next) => {
  try {
    const { stops } = req.body; // [{id, stop_order}]
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const stop of stops) {
        await client.query('UPDATE trip_stops SET stop_order=$1 WHERE id=$2 AND trip_id=$3', [stop.stop_order, stop.id, req.params.tripId]);
      }
      await client.query('COMMIT');
      res.json({ success: true, message: 'Stops reordered' });
    } catch (e) { await client.query('ROLLBACK'); throw e; }
    finally { client.release(); }
  } catch (error) { next(error); }
};

// SECTIONS
export const getSections = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM itinerary_sections WHERE trip_stop_id=$1 ORDER BY section_order',
      [req.params.stopId]
    );
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

export const addSection = async (req, res, next) => {
  try {
    const { title, sectionType, description, startDate, endDate, estimatedCost, sectionOrder } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO itinerary_sections (trip_stop_id, title, section_type, description, start_date, end_date, estimated_cost, section_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.params.stopId, title, sectionType || 'activity', description || null, startDate || null, endDate || null, estimatedCost || 0, sectionOrder || 0]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const updateSection = async (req, res, next) => {
  try {
    const { title, sectionType, description, startDate, endDate, estimatedCost, sectionOrder } = req.body;
    const { rows } = await pool.query(
      `UPDATE itinerary_sections SET title=$1, section_type=$2, description=$3, start_date=$4, end_date=$5, estimated_cost=$6, section_order=$7
       WHERE id=$8 AND trip_stop_id=$9 RETURNING *`,
      [title, sectionType || 'activity', description || null, startDate || null, endDate || null, estimatedCost || 0, sectionOrder || 0, req.params.sectionId, req.params.stopId]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Section not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const deleteSection = async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM itinerary_sections WHERE id=$1 AND trip_stop_id=$2', [req.params.sectionId, req.params.stopId]);
    if (rowCount === 0) return res.status(404).json({ success: false, message: 'Section not found' });
    res.json({ success: true, message: 'Section deleted' });
  } catch (error) { next(error); }
};
