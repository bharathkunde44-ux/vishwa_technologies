const { pool } = require("../config/db");
const { sendOwnerEmail } = require("../config/mailer");
const { requireFields, validateEmail } = require("../utils/validators");

async function createContact(req, res, next) {
  try {
    requireFields(req.body, ["name", "phone", "email", "message"]);
    validateEmail(req.body.email);

    const { name, phone, email, serviceType, location, message } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO contacts (name, phone, email, service_type, location, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, phone, email, serviceType || null, location || null, message]
    );

    await sendOwnerEmail("New CCTV Website Contact", {
      "Contact ID": result.insertId,
      "Customer name": name,
      Phone: phone,
      Email: email,
      "Service type": serviceType || "Not selected",
      Location: location || "Not provided",
      Message: message,
    });

    res.status(201).json({
      message: "Message sent successfully.",
      contactId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createContact,
};
