import Order from "../models/Order.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Get all counts in parallel for better performance
    const [
      newDeliveriesCount,
      deliveriesCompletedCount,
      pendingDeliveriesCount,
      totalPartnersCount,
      partnersReadyCount,
      partnersNotReadyCount
    ] = await Promise.all([
      // New Deliveries (orders created today with pending status)
      Order.countDocuments({
        status: "pending",
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today's start
          $lt: new Date(new Date().setHours(23, 59, 59, 999)) // Today's end
        }
      }),

      // Deliveries Completed (orders with delivered status)
      Order.countDocuments({ status: "delivered" }),

      // Pending Deliveries (all orders that are not delivered)
      Order.countDocuments({ status: { $in: ["pending", "assigned", "picked"] } }),

      // Total Partners (all users with partner role)
      User.countDocuments({ role: "partner" }),

      // Partners Ready (available partners)
      User.countDocuments({ role: "partner", availability: true }),

      // Partners Not Ready (unavailable partners)
      User.countDocuments({ role: "partner", availability: false })
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        newDeliveries: newDeliveriesCount,
        deliveriesCompleted: deliveriesCompletedCount,
        pendingDeliveries: pendingDeliveriesCount,
        totalPartners: totalPartnersCount,
        partnersReady: partnersReadyCount,
        partnersNotReady: partnersNotReadyCount
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error.message
    });
  }
};