import pool from '../config/db.js';

export const getBudget = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await pool.query('SELECT * FROM trips WHERE id=$1 AND user_id=$2', [tripId, req.user.id]);
    if (trip.rows.length === 0) return res.status(404).json({ success: false, message: 'Trip not found' });
    const byCategory = await pool.query(
      `SELECT category, SUM(amount) as total FROM expenses WHERE trip_id=$1 GROUP BY category ORDER BY total DESC`, [tripId]
    );
    const byStop = await pool.query(
      `SELECT ts.id, c.name as city_name, SUM(e.amount) as total
       FROM expenses e JOIN trip_stops ts ON e.trip_stop_id=ts.id JOIN cities c ON ts.city_id=c.id
       WHERE e.trip_id=$1 GROUP BY ts.id, c.name`, [tripId]
    );
    const byDay = await pool.query(
      `SELECT expense_date, SUM(amount) as total FROM expenses WHERE trip_id=$1 GROUP BY expense_date ORDER BY expense_date`, [tripId]
    );
    const totalSpent = byCategory.rows.reduce((sum, r) => sum + parseFloat(r.total), 0);
    const t = trip.rows[0];
    const remaining = parseFloat(t.total_budget) - totalSpent;
    const days = Math.max(1, Math.ceil((new Date(t.end_date) - new Date(t.start_date)) / (1000*60*60*24)));
    res.json({
      success: true,
      data: {
        trip: t,
        totalBudget: parseFloat(t.total_budget),
        totalSpent,
        remaining,
        budgetPct: t.total_budget > 0 ? Math.round((totalSpent / t.total_budget) * 100) : 0,
        avgPerDay: Math.round(totalSpent / days),
        byCategory: byCategory.rows,
        byStop: byStop.rows,
        byDay: byDay.rows,
        isOverBudget: remaining < 0,
        isWarning: t.total_budget > 0 && (totalSpent / t.total_budget) >= 0.8,
      },
    });
  } catch (error) { next(error); }
};

export const addExpense = async (req, res, next) => {
  try {
    const { category, description, amount, currency, quantity, unitCost, expenseDate, tripStopId } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO expenses (trip_id, trip_stop_id, category, description, amount, currency, quantity, unit_cost, expense_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.params.tripId, tripStopId || null, category, description, amount, currency || 'USD', quantity || 1, unitCost || null, expenseDate || new Date()]
    );
    await pool.query('UPDATE trips SET spent_amount = (SELECT COALESCE(SUM(amount),0) FROM expenses WHERE trip_id=$1), updated_at=NOW() WHERE id=$1', [req.params.tripId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const getExpenses = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT e.*, c.name as city_name FROM expenses e LEFT JOIN trip_stops ts ON e.trip_stop_id=ts.id LEFT JOIN cities c ON ts.city_id=c.id
       WHERE e.trip_id=$1 ORDER BY e.expense_date DESC, e.created_at DESC`,
      [req.params.tripId]
    );
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

export const updateExpense = async (req, res, next) => {
  try {
    const { category, description, amount, currency, quantity, unitCost, expenseDate } = req.body;
    const { rows } = await pool.query(
      `UPDATE expenses SET category=$1, description=$2, amount=$3, currency=$4, quantity=$5, unit_cost=$6, expense_date=$7
       WHERE id=$8 AND trip_id=$9 RETURNING *`,
      [category, description, amount, currency || 'USD', quantity || 1, unitCost || null, expenseDate, req.params.id, req.params.tripId]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Expense not found' });
    await pool.query('UPDATE trips SET spent_amount=(SELECT COALESCE(SUM(amount),0) FROM expenses WHERE trip_id=$1), updated_at=NOW() WHERE id=$1', [req.params.tripId]);
    res.json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM expenses WHERE id=$1 AND trip_id=$2', [req.params.id, req.params.tripId]);
    if (rowCount === 0) return res.status(404).json({ success: false, message: 'Expense not found' });
    await pool.query('UPDATE trips SET spent_amount=(SELECT COALESCE(SUM(amount),0) FROM expenses WHERE trip_id=$1), updated_at=NOW() WHERE id=$1', [req.params.tripId]);
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) { next(error); }
};
