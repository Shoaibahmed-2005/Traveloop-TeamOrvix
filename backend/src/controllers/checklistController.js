import pool from '../config/db.js';

export const getChecklist = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM packing_items WHERE trip_id=$1 ORDER BY category, created_at',
      [req.params.tripId]
    );
    const grouped = rows.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
    const stats = { total: rows.length, packed: rows.filter(r => r.is_packed).length };
    res.json({ success: true, data: rows, grouped, stats });
  } catch (error) { next(error); }
};

export const addItem = async (req, res, next) => {
  try {
    const { itemName, category } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO packing_items (trip_id, item_name, category) VALUES ($1,$2,$3) RETURNING *',
      [req.params.tripId, itemName, category || 'other']
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const toggleItem = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'UPDATE packing_items SET is_packed = NOT is_packed WHERE id=$1 AND trip_id=$2 RETURNING *',
      [req.params.id, req.params.tripId]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const deleteItem = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM packing_items WHERE id=$1 AND trip_id=$2', [req.params.id, req.params.tripId]);
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) { next(error); }
};

export const resetChecklist = async (req, res, next) => {
  try {
    await pool.query('UPDATE packing_items SET is_packed=false WHERE trip_id=$1', [req.params.tripId]);
    res.json({ success: true, message: 'Checklist reset' });
  } catch (error) { next(error); }
};
