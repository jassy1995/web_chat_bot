const express = require("express");
const {
  RegistrationProcess,
  Testing,
} = require("../controllers/process.controller");
const {
  getRecords,
  // savedServiceRecords,
} = require("../controllers/Records.controller");

const router = express.Router();

router.post("/api/artisan/registration/process", RegistrationProcess);
router.get("/api/all_records", getRecords);
router.post("/test", Testing);
// router.post("/api/save-service", savedServiceRecords);

module.exports = router;
