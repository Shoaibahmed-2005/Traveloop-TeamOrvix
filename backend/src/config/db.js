import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const initDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connected');

    const initSQL = fs.readFileSync(
      path.join(__dirname, '../../migrations/init.sql'),
      'utf8'
    );
    await pool.query(initSQL);
    console.log('✅ Migrations complete');

    const { rows } = await pool.query('SELECT COUNT(*) FROM cities');
    if (parseInt(rows[0].count) === 0) {
      const seedSQL = fs.readFileSync(
        path.join(__dirname, '../../seeds/seed.sql'),
        'utf8'
      );
      await pool.query(seedSQL);
      console.log('✅ Seed data loaded');
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

export default pool;
