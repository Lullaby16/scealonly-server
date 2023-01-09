const express = require("express");
const router = express.Router();
const validatePost = require("../validation/validationPost");
const {
  getPosts,
  getMyPosts,
  addPost,
  viewPosts,
  deletePosts,
  updatePosts,
  searchPost,
} = require("../controllers/postController");

router.get("/", getPosts);
router.get("/my_post", getMyPosts);
router.get("/detail", searchPost);
router.post("/", validatePost, addPost);
router.put("/view", viewPosts);
router.delete("/delete", deletePosts);
router.patch("/", updatePosts);

module.exports = router;
