const { Pool } = require("pg"); 
require("dotenv").config(); 

// Create and export a reusable database connection pool
const pool = new Pool({
    host: process.env.DB_HOST,        
    user: process.env.DB_USER,        
    database: process.env.DB_NAME,    
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,        
});

module.exports = pool; 
