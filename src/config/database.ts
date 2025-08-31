import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a new Pool instance (connection pool)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5434'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Optional: Connection pool settings
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait for a connection to be established
});

// Event listeners for the pool (optional but helpful for debugging)
pool.on('connect', (client) => {
  console.log('New client connected to PostgreSQL database');
});

pool.on('error', (err, client) => {
  console.error(' Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// Test function to verify database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    console.log(' PostgreSQL connection test successful');
    client.release();
    return true;
  } catch (error) {
    console.error(' PostgreSQL connection test failed:', error);
    return false;
  }
};

// Export the pool for use in other files
export default pool;