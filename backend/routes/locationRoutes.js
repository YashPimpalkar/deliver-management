import express from "express";
import {
  saveUserLocation,
  getUserLocation,
  saveOrderPickup,
  saveOrderDelivery,
  getOrderLocation,
} from "../controllers/locationController.js";

const router = express.Router();

// User live location
router.post("/user", saveUserLocation);
router.get("/user/:userId", getUserLocation);

// Order pickup/delivery locations
router.post("/order/pickup", saveOrderPickup);
router.post("/order/delivery", saveOrderDelivery);
router.get("/order/:orderId", getOrderLocation);

export default router;
