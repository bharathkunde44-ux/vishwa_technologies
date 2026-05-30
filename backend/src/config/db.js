require("dotenv").config();

const mysql = require("mysql2/promise");

const useSsl = process.env.DB_SSL === "true";
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false";
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  database: process.env.DB_NAME || "cctv_booking",
  ssl: useSsl ? { rejectUnauthorized } : undefined,
};

const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: process.env.DB_PASSWORD || "",
  database: dbConfig.database,
  ssl: dbConfig.ssl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT DATABASE() AS database_name, @@hostname AS mysql_host");
  connection.release();
  console.log("MySQL connected", {
    host: dbConfig.host,
    port: dbConfig.port,
    database: rows[0].database_name,
    mysqlHost: rows[0].mysql_host,
    ssl: useSsl,
  });
}

function getDbInfo() {
  return {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    ssl: useSsl,
  };
}

module.exports = {
  pool,
  testConnection,
  getDbInfo,
};
