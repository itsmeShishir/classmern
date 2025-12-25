import express from "express";
import { registerUser, getAllUser, loginUser, getUserById,getSingleUser, updateUserProfile, deleteUser, updateUser, changePasswordbyadmin, ChangePassword, adminDashboard } from "../contoller/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


router.route("/profile").get(protect, getSingleUser).put(protect, updateUserProfile);

router.route("/").get(protect,admin, getAllUser)

router.route("/:id").get(protect, getUserById).patch(protect, updateUser).delete(protect, deleteUser)
router.route("/:id/password").put(protect, admin, changePasswordbyadmin);
//  password
router.route("/password").put(protect, ChangePassword)

router.route("/admin/dashboard").get(protect, admin, adminDashboard);

export default router;