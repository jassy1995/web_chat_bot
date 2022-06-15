const express = require("express");
const {
  RegistrationProcess,
  // Testing,
} = require("../controllers/process.controller");
const { RegistrationProcess2 } = require("../controllers/process.controller_2");
const {
  getArtisanRecords,
  getCustomerRecords,
  // savedServiceRecords,
} = require("../controllers/Records.controller");

const router = express.Router();

// router.post("/api/artisan/registration/process", RegistrationProcess);
router.post("/api/artisan/registration/process", RegistrationProcess2);
router.get("/api/artisan/:start", getArtisanRecords);
router.get("/api/customer/:start", getCustomerRecords);
// router.post("/test", Testing);
// router.post("/api/save-service", savedServiceRecords);

module.exports = router;
