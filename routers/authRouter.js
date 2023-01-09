const express = require("express");
const router = express.Router();
const validateLoginForm = require("../validation/validateLoginForm");
const validateSignUpForm = require("../validation/validateSignUpForm");
const {
  handleLogin,
  attemptLogin,
  attemptRegister,
  verifyEmail,
  handleLogout,
} = require("../controllers/authController");

//LOGIN
router.route("/login").get(handleLogin).post(validateLoginForm, attemptLogin);

//SIGN UP
router.post("/signup", validateSignUpForm, attemptRegister);

//VERIFY
router.get("/verify/:token", verifyEmail);

//LOGOUT
router.post("/logout", handleLogout);

module.exports = router;
