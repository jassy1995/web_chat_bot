const express = require("express");
const { RegistrationProcess } = require("../controllers/process.controller");
const {
  getRecords,
  // savedServiceRecords,
} = require("../controllers/Records.controller");

const router = express.Router();

router.post("/api/artisan/registration/process", RegistrationProcess);
router.get("/api/all_records", getRecords);
// router.post("/api/save-service", savedServiceRecords);

module.exports = router;
