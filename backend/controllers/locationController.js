import UserLocation from "../models/UserLocation.js";
import OrderLocation from "../models/OrderLocation.js";

// Save partner live location
export const saveUserLocation = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;
    if (!userId || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const location = await UserLocation.create({ user: userId, latitude, longitude });
    res.status(201).json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get latest user location
export const getUserLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const location = await UserLocation.findOne({ user: userId }).sort({ createdAt: -1 });
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Save order pickup location/time
export const saveOrderPickup = async (req, res) => {
  try {
    const { orderId, userId, latitude, longitude, time } = req.body;
    let orderLocation = await OrderLocation.findOne({ order: orderId });

    if (!orderLocation) {
      orderLocation = new OrderLocation({ order: orderId, user: userId });
    }

    orderLocation.pickup = { latitude, longitude, time: time || new Date() };
    await orderLocation.save();

    res.status(201).json(orderLocation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Save order delivery location/time
export const saveOrderDelivery = async (req, res) => {
  try {
    const { orderId, userId, latitude, longitude, time } = req.body;
    let orderLocation = await OrderLocation.findOne({ order: orderId });

    if (!orderLocation) {
      return res.status(404).json({ message: "Order location not found" });
    }

    orderLocation.delivery = { latitude, longitude, time: time || new Date() };
    await orderLocation.save();

    res.status(201).json(orderLocation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get order location (pickup + delivery)
export const getOrderLocation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderLocation = await OrderLocation.findOne({ order: orderId });
    if (!orderLocation) return res.status(404).json({ message: "Order location not found" });
    res.json(orderLocation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
