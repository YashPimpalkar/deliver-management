import express from "express";
import {
  createOrder,
  assignOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
  editOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/", protect, createOrder);
router.put("/:id/assign", protect, assignOrder);

// Partner routes
router.get("/my-orders", protect, getMyOrders);
router.put("/:id/status", protect, updateOrderStatus);

router.get("/getall",protect, getAllOrders);


router.get("/:id", getOrderById);

// PUT update order
router.put("/:id", editOrder);

// DELETE order
router.delete("/:id", deleteOrder);


export default router;
