import pool from '../config/db.js';

export const getActivities = async (req, res, next) => {
  try {
    const { city_id, category, maxCost, minRating, search } = req.query;
    let query = `SELECT a.*, c.name as city_name, c.country FROM activities a JOIN cities c ON a.city_id=c.id WHERE 1=1`;
    const params = [];
    let idx = 1;
    if (city_id) { query += ` AND a.city_id=$${idx}`; params.push(city_id); idx++; }
    if (category) { query += ` AND a.category=$${idx}`; params.push(category); idx++; }
    if (maxCost) { query += ` AND a.estimated_cost<=$${idx}`; params.push(maxCost); idx++; }
    if (minRating) { query += ` AND a.rating>=$${idx}`; params.push(minRating); idx++; }
    if (search) { query += ` AND (a.name ILIKE $${idx} OR a.description ILIKE $${idx})`; params.push(`%${search}%`); idx++; }
    query += ' ORDER BY a.rating DESC';
    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

export const getActivityById = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT a.*, c.name as city_name, c.country FROM activities a JOIN cities c ON a.city_id=c.id WHERE a.id=$1',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const addActivityToStop = async (req, res, next) => {
  try {
    const { activityId, scheduledDate, scheduledTime, notes } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO trip_activities (trip_stop_id, activity_id, scheduled_date, scheduled_time, notes)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.params.stopId, activityId, scheduledDate || null, scheduledTime || null, notes || null]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const removeActivityFromStop = async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM trip_activities WHERE id=$1 AND trip_stop_id=$2', [req.params.id, req.params.stopId]);
    if (rowCount === 0) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, message: 'Activity removed' });
  } catch (error) { next(error); }
};
