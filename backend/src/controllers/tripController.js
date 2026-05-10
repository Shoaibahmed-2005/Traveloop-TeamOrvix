import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';

export const getTrips = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*, 
        (SELECT COUNT(*) FROM trip_stops WHERE trip_id = t.id) as stop_count,
        CASE WHEN t.total_budget > 0 THEN ROUND((t.spent_amount / t.total_budget * 100)::numeric, 1) ELSE 0 END as budget_pct
       FROM trips t WHERE t.user_id = $1 ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    const counts = await pool.query(
      `SELECT status, COUNT(*) as count FROM trips WHERE user_id=$1 GROUP BY status`,
      [req.user.id]
    );
    res.json({ success: true, data: rows, summary: counts.rows });
  } catch (error) { next(error); }
};

export const getTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT t.*, u.first_name, u.last_name FROM trips t JOIN users u ON t.user_id=u.id WHERE t.id=$1 AND (t.user_id=$2 OR t.is_public=true)`,
      [id, req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Trip not found' });
    const stops = await pool.query(
      `SELECT ts.*, c.name as city_name, c.country, c.image_url FROM trip_stops ts LEFT JOIN cities c ON ts.city_id=c.id WHERE ts.trip_id=$1 ORDER BY ts.stop_order`,
      [id]
    );
    res.json({ success: true, data: { ...rows[0], stops: stops.rows } });
  } catch (error) { next(error); }
};

export const createTrip = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, totalBudget, coverPhoto, isPublic } = req.body;
    const shareToken = uuidv4();
    const { rows } = await pool.query(
      `INSERT INTO trips (user_id, title, description, start_date, end_date, total_budget, cover_photo, is_public, share_token)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.user.id, title, description || null, startDate, endDate, totalBudget || 0, coverPhoto || null, isPublic || false, shareToken]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, totalBudget, coverPhoto, isPublic, status } = req.body;
    const { rows } = await pool.query(
      `UPDATE trips SET title=$1, description=$2, start_date=$3, end_date=$4, total_budget=$5, cover_photo=$6, is_public=$7, status=$8, updated_at=NOW()
       WHERE id=$9 AND user_id=$10 RETURNING *`,
      [title, description || null, startDate, endDate, totalBudget || 0, coverPhoto || null, isPublic || false, status || 'upcoming', id, req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM trips WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    if (rowCount === 0) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, message: 'Trip deleted' });
  } catch (error) { next(error); }
};

export const getTripSummary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tripRes = await pool.query('SELECT * FROM trips WHERE id=$1 AND user_id=$2', [id, req.user.id]);
    if (tripRes.rows.length === 0) return res.status(404).json({ success: false, message: 'Trip not found' });
    const trip = tripRes.rows[0];
    const stops = await pool.query('SELECT COUNT(*) FROM trip_stops WHERE trip_id=$1', [id]);
    const activities = await pool.query(
      'SELECT COUNT(*) FROM trip_activities ta JOIN trip_stops ts ON ta.trip_stop_id=ts.id WHERE ts.trip_id=$1', [id]
    );
    const today = new Date();
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const daysRemaining = Math.max(0, Math.ceil((startDate - today) / (1000 * 60 * 60 * 24)));
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const budgetPct = trip.total_budget > 0 ? Math.round((trip.spent_amount / trip.total_budget) * 100) : 0;
    res.json({
      success: true,
      data: {
        trip,
        stopCount: parseInt(stops.rows[0].count),
        activityCount: parseInt(activities.rows[0].count),
        totalDays,
        daysRemaining,
        budgetPct,
      },
    });
  } catch (error) { next(error); }
};

export const toggleVisibility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'UPDATE trips SET is_public = NOT is_public WHERE id=$1 AND user_id=$2 RETURNING id, is_public',
      [id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};
