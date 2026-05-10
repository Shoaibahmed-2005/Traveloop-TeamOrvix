import pool from '../config/db.js';

export const getNotes = async (req, res, next) => {
  try {
    const { stop_id } = req.query;
    let query = 'SELECT * FROM trip_notes WHERE trip_id=$1';
    const params = [req.params.tripId];
    if (stop_id) { query += ' AND trip_stop_id=$2'; params.push(stop_id); }
    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

export const addNote = async (req, res, next) => {
  try {
    const { title, content, noteType, tripStopId } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO trip_notes (trip_id, trip_stop_id, title, content, note_type) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [req.params.tripId, tripStopId || null, title || null, content, noteType || 'general']
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const updateNote = async (req, res, next) => {
  try {
    const { title, content, noteType } = req.body;
    const { rows } = await pool.query(
      'UPDATE trip_notes SET title=$1, content=$2, note_type=$3, updated_at=NOW() WHERE id=$4 AND trip_id=$5 RETURNING *',
      [title || null, content, noteType || 'general', req.params.id, req.params.tripId]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const deleteNote = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM trip_notes WHERE id=$1 AND trip_id=$2', [req.params.id, req.params.tripId]);
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) { next(error); }
};
