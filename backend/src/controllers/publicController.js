import pool from '../config/db.js';

export const getPublicItinerary = async (req, res, next) => {
  try {
    const { shareToken } = req.params;
    const tripRes = await pool.query(
      `SELECT t.*, u.first_name, u.last_name FROM trips t JOIN users u ON t.user_id=u.id WHERE t.share_token=$1 AND t.is_public=true`,
      [shareToken]
    );
    if (tripRes.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Itinerary not found or not public' });
    const trip = tripRes.rows[0];
    await pool.query(
      'UPDATE community_posts SET views_count=views_count+1 WHERE trip_id=$1',
      [trip.id]
    );
    const stops = await pool.query(
      `SELECT ts.*, c.name as city_name, c.country, c.image_url FROM trip_stops ts
       JOIN cities c ON ts.city_id=c.id WHERE ts.trip_id=$1 ORDER BY ts.stop_order`,
      [trip.id]
    );
    const sections = await pool.query(
      `SELECT isec.*, ts.trip_id FROM itinerary_sections isec
       JOIN trip_stops ts ON isec.trip_stop_id=ts.id WHERE ts.trip_id=$1 ORDER BY isec.section_order`,
      [trip.id]
    );
    res.json({ success: true, data: { trip, stops: stops.rows, sections: sections.rows } });
  } catch (error) { next(error); }
};
