const path = require("path");
const { pool } = require("../config/db");
const { sendOwnerEmail } = require("../config/mailer");
const { requireFields, validateEmail } = require("../utils/validators");

async function createMaintenanceRequest(req, res, next) {
  try {
    requireFields(req.body, ["name", "phone", "email", "issueDescription", "preferredVisitDate"]);
    validateEmail(req.body.email);

    const { name, phone, email, issueDescription, preferredVisitDate, message } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.execute(
      `INSERT INTO maintenance_requests
        (name, phone, email, issue_description, issue_image, preferred_visit_date, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, email, issueDescription, imagePath, preferredVisitDate, message || null]
    );

    const attachments = req.file
      ? [
          {
            filename: req.file.originalname,
            path: path.resolve(req.file.path),
          },
        ]
      : [];

    await sendOwnerEmail(
      "New CCTV Maintenance Request",
      {
        "Request ID": result.insertId,
        "Customer name": name,
        Phone: phone,
        Email: email,
        "Issue description": issueDescription,
        "Preferred visit date": preferredVisitDate,
        "Image uploaded": imagePath || "No image",
        Message: message || "No message",
      },
      attachments
    );

    res.status(201).json({
      message: "Maintenance request submitted successfully.",
      requestId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createMaintenanceRequest,
};
