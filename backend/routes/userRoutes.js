import express from "express";
import { deletePartner, editPartner, getAllPartners, getAvailablePartners, updateAvailability } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// PUT /api/users/availability/:userId
router.put("/availability/:userId", updateAvailability);
router.get("/available", getAvailablePartners);
router.get("/allpartners", protect, getAllPartners);
router.put("/:id", editPartner);
router.delete("/:id", deletePartner);

export default router;
