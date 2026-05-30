require("dotenv").config();

const { pool, getDbInfo } = require("../src/config/db");

async function checkBookings() {
  console.log("Checking bookings from database:", getDbInfo());

  const [countRows] = await pool.query("SELECT COUNT(*) AS total FROM bookings");
  const [latestRows] = await pool.query(
    `SELECT id, full_name, phone, email, service_type, preferred_date, preferred_time, created_at
     FROM bookings
     ORDER BY id DESC
     LIMIT 5`
  );

  console.log("Total bookings:", countRows[0].total);
  console.table(latestRows);

  await pool.end();
}

checkBookings().catch((error) => {
  console.error("Booking check failed:", error.message);
  process.exit(1);
});
