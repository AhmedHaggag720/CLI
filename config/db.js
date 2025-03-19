const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5432, // Default PostgreSQL port
});

// Run connection test

const testConnection = async () => {
    try {
        const client = await pool.connect(); // Get a client from the pool
        console.log("✅ PostgreSQL connected successfully.");
        client.release(); // Release the client
    } catch (error) {
        console.error("❌ PostgreSQL connection failed:", error);
    }
};


testConnection();
//test
module.exports =  pool ;
