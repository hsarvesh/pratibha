import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root or server directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

export const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'pratibha',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_POOL_MAX || '20', 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  connectionString: process.env.DATABASE_URL || undefined
};

// Create connection pool
export const pool = new Pool(
  dbConfig.connectionString
    ? { connectionString: dbConfig.connectionString, ssl: dbConfig.ssl }
    : {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        user: dbConfig.user,
        password: dbConfig.password,
        ssl: dbConfig.ssl,
        max: dbConfig.max,
        idleTimeoutMillis: dbConfig.idleTimeoutMillis,
        connectionTimeoutMillis: dbConfig.connectionTimeoutMillis
      }
);

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]: Unexpected error on idle client', err.message);
});

/**
 * Execute parameterized SQL query with automatic client retrieval and release
 */
export async function query(text, params = []) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.DB_DEBUG === 'true') {
      console.log(`[PG Query] ${text.slice(0, 80)}... [${duration}ms] (${res.rowCount} rows)`);
    }
    return res;
  } catch (err) {
    console.error(`[PG Query Error] SQL: ${text}`, err.message);
    throw err;
  }
}

/**
 * Get a dedicated client from pool (useful for transactions)
 */
export async function getClient() {
  const client = await pool.connect();
  return client;
}

/**
 * Test connectivity with PostgreSQL server
 */
export async function testConnection() {
  try {
    const res = await query('SELECT NOW() as current_time, current_database() as database, current_user as user, version() as version');
    return {
      connected: true,
      time: res.rows[0].current_time,
      database: res.rows[0].database,
      user: res.rows[0].user,
      version: res.rows[0].version
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
      code: err.code
    };
  }
}

export default {
  pool,
  query,
  getClient,
  testConnection,
  dbConfig
};
