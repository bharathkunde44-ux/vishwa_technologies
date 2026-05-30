const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const {
  getBookings,
  getMaintenanceRequests,
  getContacts,
  updateBookingStatus,
  updateMaintenanceStatus,
  deleteBooking,
  deleteMaintenanceRequest,
  deleteContact,
} = require("../controllers/adminController");

const router = express.Router();

router.use(adminAuth);

router.get("/bookings", getBookings);
router.get("/maintenance", getMaintenanceRequests);
router.get("/contacts", getContacts);
router.patch("/bookings/:id/status", updateBookingStatus);
router.patch("/maintenance/:id/status", updateMaintenanceStatus);
router.delete("/bookings/:id", deleteBooking);
router.delete("/maintenance/:id", deleteMaintenanceRequest);
router.delete("/contacts/:id", deleteContact);

module.exports = router;
