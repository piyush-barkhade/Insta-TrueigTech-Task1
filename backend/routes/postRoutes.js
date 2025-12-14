import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createPost,
  toggleLike,
  addComment,
  feed,
  getPostById,
  getPostComments,
  getUserPosts,
} from "../controllers/postController.js";
const router = express.Router();
router.post("/", auth, createPost);
router.get("/feed", auth, feed);
router.put("/:id/like", auth, toggleLike);
router.post("/:id/comment", auth, addComment);
router.get("/user/:userId", auth, getUserPosts);
router.get("/:id/comments", auth, getPostComments);
router.get("/:id", auth, getPostById);
export default router;
