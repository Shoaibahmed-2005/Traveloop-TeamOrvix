import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ success: false, message: 'No credential provided' });

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name: firstName, family_name: lastName, picture } = payload;

    // Check if user already exists
    let { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = rows[0];

    if (!user) {
      // Register new user via Google
      const result = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password_hash, profile_photo, google_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, first_name, last_name, email, role, phone, city, country, profile_photo, created_at`,
        [firstName, lastName || '', email, 'GOOGLE_AUTH_NO_PASSWORD', picture || null, googleId]
      );
      user = result.rows[0];
    } else {
      // Update google_id if not set
      if (!user.google_id) {
        await pool.query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
      }
    }

    const safeUser = {
      id: user.id, first_name: user.first_name, last_name: user.last_name,
      email: user.email, role: user.role, phone: user.phone,
      city: user.city, country: user.country, profile_photo: user.profile_photo,
    };

    res.json({ success: true, data: { user: safeUser, token: generateToken(user) } });
  } catch (error) {
    console.error('Google auth error:', error.message);
    next(error);
  }
};
