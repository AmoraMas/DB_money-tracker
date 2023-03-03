// THIS FILE IS USED TO STORE DB CONNECTION INFORMATION

const { Pool } = require('pg');
// take in environmental variables for DB connection, or use default if not defined
// our local environment may not have them, but Render will when deployed
const POSTGRES_HOST =  process.env.POSTGRES_HOST || 'postgres-db';
const POSTGRES_DB = process.env.POSTGRES_DB || 'money';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'password';
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const DATABASE_URL = process.env.DATABASE_URL;

// object with connection values we can pass to new Pool() to connect to DB
const dbConfig = {
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: 5432,
};

// if DATABASE_URL is set as an environmental variable (from Render), use that
// otherwise, use the config object we defined above
const pool = DATABASE_URL ? new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }) : new Pool(dbConfig);

module.exports = pool;