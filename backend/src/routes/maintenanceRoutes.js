const express = require("express");
const upload = require("../middleware/upload");
const { createMaintenanceRequest } = require("../controllers/maintenanceController");

const router = express.Router();

router.post("/", upload.single("issueImage"), createMaintenanceRequest);

module.exports = router;
