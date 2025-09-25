import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getDashboardStats, getPartnerDeliveryStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/admin/stats", protect, getDashboardStats);
router.get("/partner/stats/:userId", protect, getPartnerDeliveryStats);

export default router;