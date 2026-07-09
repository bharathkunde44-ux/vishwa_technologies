function requireFields(body, fields) {
  const missing = fields.filter((field) => !String(body[field] || "").trim());
  if (missing.length > 0) {
    const error = new Error(`Missing required fields: ${missing.join(", ")}`);
    error.status = 400;
    throw error;
  }
}

function validateEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const error = new Error("Please provide a valid email address");
    error.status = 400;
    throw error;
  }
}

function validateName(name, label = "Name") {
  const value = String(name || "").trim();
  if (!/^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(value)) {
    const error = new Error(`${label} should contain letters only`);
    error.status = 400;
    throw error;
  }
}

function validatePhone(phone) {
  const value = String(phone || "").trim();
  const digits = value.replace(/\D/g, "");

  if (!/^\+?[0-9\s()-]+$/.test(value) || digits.length < 10 || digits.length > 15) {
    const error = new Error("Please provide a valid phone number");
    error.status = 400;
    throw error;
  }
}

function validateStatus(status) {
  const allowed = ["Pending", "Confirmed", "Scheduled", "In Progress", "Completed", "Cancelled"];
  if (!allowed.includes(status)) {
    const error = new Error("Invalid status");
    error.status = 400;
    throw error;
  }
}

function validateMaintenanceStatus(status) {
  const allowed = ["Pending", "Assigned", "In Progress", "Completed"];
  if (!allowed.includes(status)) {
    const error = new Error("Invalid maintenance status");
    error.status = 400;
    throw error;
  }
}

module.exports = {
  requireFields,
  validateEmail,
  validateName,
  validatePhone,
  validateStatus,
  validateMaintenanceStatus,
};
