import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { dbConfig, pool } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Client } = pg;

async function ensureDatabaseExists() {
  const targetDb = dbConfig.database;
  if (!targetDb) return;

  // Connect to default 'postgres' database to check if targetDb exists
  const adminClient = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: 'postgres',
    ssl: dbConfig.ssl
  });

  try {
    await adminClient.connect();
    const checkRes = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDb]
    );

    if (checkRes.rowCount === 0) {
      console.log(`[Init DB] Database "${targetDb}" does not exist. Creating...`);
      // Escape identifier safely
      await adminClient.query(`CREATE DATABASE "${targetDb.replace(/"/g, '""')}"`);
      console.log(`[Init DB] Database "${targetDb}" created successfully.`);
    } else {
      console.log(`[Init DB] Database "${targetDb}" already exists.`);
    }
  } catch (err) {
    console.warn(`[Init DB Notice] Could not verify/create database via admin client (${err.message}). Proceeding directly with configured pool...`);
  } finally {
    try {
      await adminClient.end();
    } catch (_) {}
  }
}

export async function initializeDatabase() {
  console.log('----------------------------------------------------');
  console.log(`[Init DB] Initializing Pratibha PostgreSQL Database:`);
  console.log(`  Host:     ${dbConfig.host}:${dbConfig.port}`);
  console.log(`  Database: ${dbConfig.database}`);
  console.log(`  User:     ${dbConfig.user}`);
  console.log('----------------------------------------------------');

  await ensureDatabaseExists();

  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at ${schemaPath}`);
  }

  const sql = fs.readFileSync(schemaPath, 'utf-8');
  const client = await pool.connect();
  try {
    console.log('[Init DB] Applying schema.sql...');
    await client.query(sql);
    // Ensure incremental migration columns exist
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;`);
    console.log('[Init DB] Schema successfully applied!');

    // Verify created tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tableNames = tablesRes.rows.map(r => r.table_name);
    console.log('[Init DB] Verified tables in database:', tableNames.join(', '));
    return { success: true, tables: tableNames };
  } catch (err) {
    console.error('[Init DB Error] Failed to apply schema:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Allow direct execution: node server/db/initDb.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase()
    .then(() => {
      console.log('[Init DB] Database initialization completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Init DB Fatal Error]:', err.message);
      process.exit(1);
    });
}
