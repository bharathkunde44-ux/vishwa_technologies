require("dotenv").config();

const mysql = require("mysql2/promise");

const database = process.env.DB_NAME || "cctv_booking";
const useSsl = process.env.DB_SSL === "true";
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false";

const tables = {
  bookings: [
    ["full_name", "VARCHAR(120) NOT NULL"],
    ["phone", "VARCHAR(30) NOT NULL"],
    ["email", "VARCHAR(160) NOT NULL DEFAULT ''"],
    ["service_address", "TEXT NULL"],
    [
      "service_type",
      "ENUM('New CCTV Installation', 'Repair', 'Maintenance', 'Camera Upgrade') NOT NULL DEFAULT 'New CCTV Installation'",
    ],
    ["cameras", "INT NOT NULL DEFAULT 1"],
    ["preferred_date", "DATE NULL"],
    ["preferred_time", "TIME NULL"],
    ["message", "TEXT NULL"],
    ["status", "ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending'"],
    ["created_at", "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"],
    ["updated_at", "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"],
  ],
  maintenance_requests: [
    ["name", "VARCHAR(120) NOT NULL"],
    ["phone", "VARCHAR(30) NOT NULL"],
    ["email", "VARCHAR(160) NOT NULL"],
    ["issue_description", "TEXT NOT NULL"],
    ["issue_image", "VARCHAR(255) NULL"],
    ["preferred_visit_date", "DATE NOT NULL"],
    ["message", "TEXT NULL"],
    ["status", "ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending'"],
    ["created_at", "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"],
    ["updated_at", "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"],
  ],
  contacts: [
    ["name", "VARCHAR(120) NOT NULL"],
    ["phone", "VARCHAR(30) NOT NULL"],
    ["email", "VARCHAR(160) NOT NULL"],
    ["service_type", "VARCHAR(80) NULL"],
    ["location", "TEXT NULL"],
    ["message", "TEXT NOT NULL"],
    ["created_at", "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"],
  ],
};

async function tableExists(connection, tableName) {
  const [rows] = await connection.execute(
    "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
    [database, tableName]
  );
  return rows.length > 0;
}

async function columnExists(connection, tableName, columnName) {
  const [rows] = await connection.execute(
    "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?",
    [database, tableName, columnName]
  );
  return rows.length > 0;
}

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    ssl: useSsl ? { rejectUnauthorized } : undefined,
    multipleStatements: true,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  await connection.query(`USE \`${database}\``);

  for (const [tableName, columns] of Object.entries(tables)) {
    if (!(await tableExists(connection, tableName))) {
      const columnSql = columns.map(([name, definition]) => `\`${name}\` ${definition}`).join(", ");
      await connection.query(`CREATE TABLE \`${tableName}\` (id INT AUTO_INCREMENT PRIMARY KEY, ${columnSql})`);
      console.log(`Created table: ${tableName}`);
      continue;
    }

    for (const [columnName, definition] of columns) {
      if (!(await columnExists(connection, tableName, columnName))) {
        await connection.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${definition}`);
        console.log(`Added ${tableName}.${columnName}`);
      }
    }
  }

  if (!(await tableExists(connection, "admin_users"))) {
    await connection.query(`
      CREATE TABLE admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(160) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('Owner', 'Staff') NOT NULL DEFAULT 'Owner',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Created table: admin_users");
  }

  await connection.end();
  console.log("Database migration complete.");
}

migrate().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
