import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/admin/stats", protect, getDashboardStats);

export default router;