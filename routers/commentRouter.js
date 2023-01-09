const express = require("express");
const router = express.Router();
const validateComment = require("../validation/validationComment");
const {
  addComment,
  getComment,
  getTotalComment,
  deleteComment,
  updateComment,
} = require("../controllers/commentController");

router.get("/", getComment);
router.get("/total", getTotalComment);
router.post("/", validateComment, addComment);
router.delete("/", deleteComment);
router.patch("/", updateComment);

module.exports = router;
