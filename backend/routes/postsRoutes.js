const express = require("express");
const router = express.Router();
const protectedRoute = require("../middleware/protectedRoutes");
const {
  createPost,
  deletePost,
  commentOnPost,
  LikeUnlikePost,
  getAllPost,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
} = require("../controller/postController");


router.post("/create" , protectedRoute , createPost)
router.delete("/delete/:id" , protectedRoute , deletePost)
router.post("/comment/:id" , protectedRoute , commentOnPost)
router.post("/like/:id" , protectedRoute , LikeUnlikePost)
router.get("/all" ,protectedRoute, getAllPost)
router.get("/likes/:id" , protectedRoute , getLikedPosts)
router.get("/following" , protectedRoute , getFollowingPosts)
router.get("/user/:username" , protectedRoute , getUserPosts)

module.exports = router;