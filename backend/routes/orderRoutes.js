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
  getOrdersByPartner,
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


router.get("/:id", protect, getOrderById);
router.get("/partner/:id", protect, getOrdersByPartner);

// PUT update order
router.put("/:id", protect, editOrder);

// DELETE order
router.delete("/:id", protect, deleteOrder);


export default router;
