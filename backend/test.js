const pool = require("./src/db");

const testConnection = async () => {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("Database connected successfully!");
        console.log("Current time from database:", result.rows[0]);
    } catch (err) {
        console.error("Database connection error:", err);
    } finally {
        pool.end(); // Close the connection pool
    }
};

testConnection();
