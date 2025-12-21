import express from "express";
import {
    initializedEsewaPayment,verifyEsewaPayment,initializedKhaltiPayment,verifyKhaltiPayment
} from "../contoller/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// esewa Routes
router.post("/esewa/initialize", protect, initializedEsewaPayment);
router.post("/esewa/callback", protect, verifyEsewaPayment);

// khalti Routes
router.post("/khalti/initialize", protect, initializedKhaltiPayment);
router.post("/khalti/callback", protect, verifyKhaltiPayment);

export default router;