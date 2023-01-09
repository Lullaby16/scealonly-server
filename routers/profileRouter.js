const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/profileController");

router.get("/", getProfile);

module.exports = router;
