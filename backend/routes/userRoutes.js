import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  toggleFollow,
  getUserProfile,
  getSuggestedUsers,
  updateProfilePic,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/suggestions", auth, getSuggestedUsers);
router.put("/profilePic", auth, updateProfilePic);
router.get("/:id", auth, getUserProfile);
router.put("/:id/follow", auth, toggleFollow);

export default router;
