import express from "express";
import { getAvailablePartners, updateAvailability } from "../controllers/userController.js";

const router = express.Router();

// PUT /api/users/availability/:userId
router.put("/availability/:userId", updateAvailability);
router.get("/available", getAvailablePartners);

export default router;
