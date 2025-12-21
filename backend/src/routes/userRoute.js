import express from "express";
import { registerUser, getAllUser, loginUser, getUserById, updateUserProfile, deleteUser, changePassword } from "../contoller/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


router.route("/profile").get(protect, getUserById).put(protect, updateUserProfile);

router.route("/").get(protect,admin, getAllUser)

router.route("/:id").get(protect, admin, getAllUser).put(protect, admin, updateUserProfile).delete(protect, admin, deleteUser)
//  password
router.route("/:id/password").put(protect, admin, changePassword)

export default router;