import pool from '../config/db.js';

export const getPosts = async (req, res, next) => {
  try {
    const { search, sort, group } = req.query;
    let query = `SELECT cp.*, t.title as trip_title, t.start_date, t.end_date, t.cover_photo,
      u.first_name, u.last_name,
      (SELECT COUNT(DISTINCT ts.city_id) FROM trip_stops ts WHERE ts.trip_id=t.id) as dest_count
      FROM community_posts cp JOIN trips t ON cp.trip_id=t.id JOIN users u ON cp.user_id=u.id WHERE 1=1`;
    const params = [];
    let idx = 1;
    if (search) { query += ` AND (cp.title ILIKE $${idx} OR cp.description ILIKE $${idx})`; params.push(`%${search}%`); idx++; }
    if (sort === 'likes') query += ' ORDER BY cp.likes_count DESC';
    else if (sort === 'views') query += ' ORDER BY cp.views_count DESC';
    else query += ' ORDER BY cp.created_at DESC';
    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

export const publishTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { description } = req.body;
    await pool.query('UPDATE trips SET is_public=true WHERE id=$1 AND user_id=$2', [tripId, req.user.id]);
    const trip = await pool.query('SELECT title FROM trips WHERE id=$1', [tripId]);
    if (trip.rows.length === 0) return res.status(404).json({ success: false, message: 'Trip not found' });
    const existing = await pool.query('SELECT id FROM community_posts WHERE trip_id=$1', [tripId]);
    let post;
    if (existing.rows.length > 0) {
      const r = await pool.query('UPDATE community_posts SET description=$1 WHERE trip_id=$2 RETURNING *', [description, tripId]);
      post = r.rows[0];
    } else {
      const r = await pool.query(
        'INSERT INTO community_posts (trip_id, user_id, title, description) VALUES ($1,$2,$3,$4) RETURNING *',
        [tripId, req.user.id, trip.rows[0].title, description || null]
      );
      post = r.rows[0];
    }
    res.status(201).json({ success: true, data: post });
  } catch (error) { next(error); }
};

export const likePost = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'UPDATE community_posts SET likes_count=likes_count+1 WHERE id=$1 RETURNING id, likes_count',
      [req.params.postId]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const getPost = async (req, res, next) => {
  try {
    const r = await pool.query(
      `SELECT cp.*, t.*, u.first_name, u.last_name FROM community_posts cp
       JOIN trips t ON cp.trip_id=t.id JOIN users u ON cp.user_id=u.id WHERE cp.id=$1`,
      [req.params.postId]
    );
    if (r.rows.length === 0) return res.status(404).json({ success: false, message: 'Post not found' });
    await pool.query('UPDATE community_posts SET views_count=views_count+1 WHERE id=$1', [req.params.postId]);
    const stops = await pool.query(
      `SELECT ts.*, c.name as city_name, c.country FROM trip_stops ts JOIN cities c ON ts.city_id=c.id WHERE ts.trip_id=$1 ORDER BY ts.stop_order`,
      [r.rows[0].trip_id]
    );
    res.json({ success: true, data: { ...r.rows[0], stops: stops.rows } });
  } catch (error) { next(error); }
};
