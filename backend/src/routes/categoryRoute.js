import express from "express";
import { getAllCategory, createCategory, updateCategory, destroyCategory, getSingleCategory } from "../contoller/categoryContoller.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/")
.get(getAllCategory)
.post(protect, admin, upload.single("image"), createCategory)
router.route("/:id")
.get(getSingleCategory)
.patch(protect, admin, upload.single("image"), updateCategory)
.delete(protect, admin, destroyCategory)

export default router;