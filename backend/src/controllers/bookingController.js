const { pool, getDbInfo } = require("../config/db");
const { sendOwnerEmailInBackground } = require("../config/mailer");
const { requireFields, validateEmail } = require("../utils/validators");

async function createBooking(req, res, next) {
  try {
    requireFields(req.body, [
      "fullName",
      "phone",
      "email",
      "serviceAddress",
      "serviceType",
      "cameras",
      "preferredDate",
      "preferredTime",
    ]);
    validateEmail(req.body.email);

    const {
      fullName,
      phone,
      email,
      serviceAddress,
      serviceType,
      cameras,
      preferredDate,
      preferredTime,
      message,
    } = req.body;

    console.log("Booking insert started", {
      db: getDbInfo(),
      customer: fullName,
      phone,
      email,
      serviceType,
    });

    const [result] = await pool.execute(
      `INSERT INTO bookings
        (full_name, phone, email, service_address, service_type, cameras, preferred_date, preferred_time, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        phone,
        email,
        serviceAddress,
        serviceType,
        Number(cameras),
        preferredDate,
        preferredTime,
        message || null,
      ]
    );

    console.log("Booking insert completed", {
      db: getDbInfo(),
      insertId: result.insertId,
      affectedRows: result.affectedRows,
    });

    sendOwnerEmailInBackground("New CCTV Booking Request", {
      "Booking ID": result.insertId,
      Status: "Pending",
      "Customer name": fullName,
      Phone: phone,
      Email: email,
      "Service type": serviceType,
      Cameras: cameras,
      "Preferred date": preferredDate,
      "Preferred time": preferredTime,
      Location: serviceAddress,
      Message: message || "No message",
    });

    res.status(201).json({
      message: "Booking submitted successfully. We will contact you shortly.",
      bookingId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBooking,
};
