const { pool } = require("../config/db");
const { sendOwnerEmail } = require("../config/mailer");
const { validateStatus } = require("../utils/validators");

function searchSql(search, fields) {
  if (!search) {
    return { clause: "", values: [] };
  }

  const clause = `WHERE ${fields.map((field) => `${field} LIKE ?`).join(" OR ")}`;
  const values = fields.map(() => `%${search}%`);
  return { clause, values };
}

async function getBookings(req, res, next) {
  try {
    const { clause, values } = searchSql(req.query.search, ["full_name", "phone", "email", "service_type"]);
    const [rows] = await pool.execute(
      `SELECT * FROM bookings ${clause} ORDER BY created_at DESC`,
      values
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

async function getMaintenanceRequests(req, res, next) {
  try {
    const { clause, values } = searchSql(req.query.search, ["name", "phone", "email", "issue_description"]);
    const [rows] = await pool.execute(
      `SELECT * FROM maintenance_requests ${clause} ORDER BY created_at DESC`,
      values
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

async function getContacts(req, res, next) {
  try {
    const { clause, values } = searchSql(req.query.search, ["name", "phone", "email", "message"]);
    const [rows] = await pool.execute(
      `SELECT * FROM contacts ${clause} ORDER BY created_at DESC`,
      values
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

async function updateBookingStatus(req, res, next) {
  try {
    validateStatus(req.body.status);
    await pool.execute("UPDATE bookings SET status = ? WHERE id = ?", [req.body.status, req.params.id]);
    res.json({ message: "Booking status updated" });
  } catch (error) {
    next(error);
  }
}

async function updateMaintenanceStatus(req, res, next) {
  try {
    validateStatus(req.body.status);
    await pool.execute("UPDATE maintenance_requests SET status = ? WHERE id = ?", [
      req.body.status,
      req.params.id,
    ]);
    res.json({ message: "Maintenance status updated" });
  } catch (error) {
    next(error);
  }
}

async function deleteBooking(req, res, next) {
  try {
    await pool.execute("DELETE FROM bookings WHERE id = ?", [req.params.id]);
    res.json({ message: "Booking deleted" });
  } catch (error) {
    next(error);
  }
}

async function deleteMaintenanceRequest(req, res, next) {
  try {
    await pool.execute("DELETE FROM maintenance_requests WHERE id = ?", [req.params.id]);
    res.json({ message: "Maintenance request deleted" });
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    await pool.execute("DELETE FROM contacts WHERE id = ?", [req.params.id]);
    res.json({ message: "Contact message deleted" });
  } catch (error) {
    next(error);
  }
}

async function testOwnerEmail(req, res, next) {
  try {
    const missing = ["GMAIL_USER", "GMAIL_APP_PASSWORD", "OWNER_EMAIL"].filter((key) => !process.env[key]);
    if (missing.length > 0) {
      const error = new Error(`Missing email environment variables: ${missing.join(", ")}`);
      error.status = 500;
      throw error;
    }

    await sendOwnerEmail("CCTV Website Email Test", {
      Source: "Admin email test",
      Status: "Render can send owner emails",
      Time: new Date().toISOString(),
    });

    res.json({ message: "Test email sent successfully." });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBookings,
  getMaintenanceRequests,
  getContacts,
  updateBookingStatus,
  updateMaintenanceStatus,
  deleteBooking,
  deleteMaintenanceRequest,
  deleteContact,
  testOwnerEmail,
};
