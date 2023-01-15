const express = require("express");
const router = express.Router();
require("dotenv").config();

router.get("/", (req, res) => {
  res.json(`Welcome to my server ${process.env.COMMENT}`);
});

module.exports = router;
