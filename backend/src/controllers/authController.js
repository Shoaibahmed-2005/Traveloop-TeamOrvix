import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, city, country, additionalInfo } = req.body;
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0)
      return res.status(409).json({ success: false, message: 'Email already registered' });
    const password_hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, phone, city, country, additional_info)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, first_name, last_name, email, role, phone, city, country, created_at`,
      [firstName, lastName, email, password_hash, phone || null, city || null, country || null, additionalInfo || null]
    );
    const user = rows[0];
    res.status(201).json({ success: true, data: { user, token: generateToken(user) } });
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query(
      'SELECT id, first_name, last_name, email, password_hash, role, phone, city, country, profile_photo, is_active FROM users WHERE email = $1',
      [email]
    );
    if (rows.length === 0)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const user = rows[0];
    if (!user.is_active)
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const { password_hash, ...safeUser } = user;
    res.json({ success: true, data: { user: safeUser, token: generateToken(user) } });
  } catch (error) { next(error); }
};

export const getMe = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, first_name, last_name, email, role, phone, city, country, profile_photo, additional_info, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};

export const logout = (req, res) => res.json({ success: true, message: 'Logged out' });

export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, city, country, additionalInfo, profilePhoto } = req.body;
    const { rows } = await pool.query(
      `UPDATE users SET first_name=$1, last_name=$2, phone=$3, city=$4, country=$5, additional_info=$6, profile_photo=$7, updated_at=NOW()
       WHERE id=$8 RETURNING id, first_name, last_name, email, role, phone, city, country, profile_photo, additional_info, created_at`,
      [firstName, lastName, phone || null, city || null, country || null, additionalInfo || null, profilePhoto || null, req.user.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) { next(error); }
};
