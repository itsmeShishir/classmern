import express from "express";
import {
    getOrders,
    createOrder,
    updateOrderToPaid,
    updateOrderToDelivered, 
    getMyOrders,
    getOrderById
} from "../contoller/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, admin, getOrders).post(protect, createOrder);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/:id").get(protect, getOrderById);

export default router;
