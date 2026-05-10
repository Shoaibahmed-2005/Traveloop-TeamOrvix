import pool from '../config/db.js';

export const getStats = async (req, res, next) => {
  try {
    const [users, trips, publicTrips, topCity, statusBreakdown, newUsers] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE role=\'user\''),
      pool.query('SELECT COUNT(*) FROM trips'),
      pool.query('SELECT COUNT(*) FROM trips WHERE is_public=true'),
      pool.query(`SELECT c.name, COUNT(ts.id) as trip_count FROM trip_stops ts JOIN cities c ON ts.city_id=c.id GROUP BY c.name ORDER BY trip_count DESC LIMIT 1`),
      pool.query('SELECT status, COUNT(*) as count FROM trips GROUP BY status'),
      pool.query(`SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days'`),
    ]);
    res.json({
      success: true,
      data: {
        totalUsers: parseInt(users.rows[0].count),
        totalTrips: parseInt(trips.rows[0].count),
        publicTrips: parseInt(publicTrips.rows[0].count),
        topCity: topCity.rows[0] || null,
        statusBreakdown: statusBreakdown.rows,
        newUsersLast30Days: parseInt(newUsers.rows[0].count),
      },
    });
  } catch (error) { next(error); }
};

export const getUsers = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.is_active, u.city, u.country, u.created_at,
       COUNT(t.id) as trip_count FROM users u LEFT JOIN trips t ON t.user_id=u.id GROUP BY u.id ORDER BY u.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

export const getAllTrips = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*, u.first_name, u.last_name, u.email FROM trips t JOIN users u ON t.user_id=u.id ORDER BY t.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'UPDATE users SET is_active=NOT is_active WHERE id=$1 RETURNING id, is_active',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};
