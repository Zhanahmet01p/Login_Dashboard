const { Pool } = require('pg');
require('dotenv').config();

const config = process.env.DATABASE_URL
  ? {
    
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, 
      },
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_DATABASE,
      ssl: process.env.DB_HOST !== '127.0.0.1' && process.env.DB_HOST !== 'localhost'
        ? { rejectUnauthorized: false }
        : false,
    };

const pool = new Pool(config);

module.exports = pool;