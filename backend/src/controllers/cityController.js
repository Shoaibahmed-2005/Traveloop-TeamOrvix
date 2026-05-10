import pool from '../config/db.js';

export const getCities = async (req, res, next) => {
  try {
    const { search, country, region, sort } = req.query;
    let query = 'SELECT * FROM cities WHERE 1=1';
    const params = [];
    let idx = 1;
    if (search) { query += ` AND (name ILIKE $${idx} OR country ILIKE $${idx})`; params.push(`%${search}%`); idx++; }
    if (country) { query += ` AND country = $${idx}`; params.push(country); idx++; }
    if (region) { query += ` AND region = $${idx}`; params.push(region); idx++; }
    if (sort === 'cost_asc') query += ' ORDER BY cost_index ASC';
    else if (sort === 'cost_desc') query += ' ORDER BY cost_index DESC';
    else query += ' ORDER BY popularity_score DESC';
    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

export const getPopularCities = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cities ORDER BY popularity_score DESC LIMIT 10');
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

export const getRegions = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT DISTINCT region FROM cities WHERE region IS NOT NULL ORDER BY region');
    res.json({ success: true, data: rows.map(r => r.region) });
  } catch (error) { next(error); }
};

export const getCityById = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cities WHERE id=$1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'City not found' });
    const acts = await pool.query('SELECT * FROM activities WHERE city_id=$1 ORDER BY rating DESC', [req.params.id]);
    res.json({ success: true, data: { ...rows[0], activities: acts.rows } });
  } catch (error) { next(error); }
};
