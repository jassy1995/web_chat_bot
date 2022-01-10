const express = require("express");
const { RegistrationProcess } = require("../controllers/process.controller");
const router = express.Router();

router.post("/api/artisan/registration/process", RegistrationProcess);
module.exports = router;
