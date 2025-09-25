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




export const getPartnerDeliveryStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user exists and is a partner
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "partner") {
      return res.status(400).json({ error: "User is not a partner" });
    }

    // Get current date for filtering
    const currentDate = new Date();

    // Get completed deliveries (delivered status)
    const completedDeliveries = await Order.find({
      assignedPartner: userId,
      status: "delivered"
    }).sort({ deliveryDate: -1 });

    // Get pending deliveries (pending, assigned, or picked status with future delivery date)
    const pendingDeliveries = await Order.find({
      assignedPartner: userId,
      status: { $in: ["pending", "assigned", "picked"] },
      deliveryDate: { $gte: currentDate }
    }).sort({ deliveryDate: 1 });

    // Get overdue deliveries (pending, assigned, or picked status with past delivery date)
    const overdueDeliveries = await Order.find({
      assignedPartner: userId,
      status: { $in: ["pending", "assigned", "picked"] },
      deliveryDate: { $lt: currentDate }
    }).sort({ deliveryDate: 1 });

    // Calculate statistics
    const totalCompleted = completedDeliveries.length;
    const totalPending = pendingDeliveries.length;
    const totalOverdue = overdueDeliveries.length;
    const totalAssigned = totalPending + totalOverdue + totalCompleted;

    // Calculate completion rate
    const completionRate = totalAssigned > 0 
      ? Math.round((totalCompleted / totalAssigned) * 100) 
      : 0;

    res.status(200).json({
      partner: {
        id: user._id,
        name: user.name,
        email: user.email,
        availability: user.availability
      },
      statistics: {
        deliveriesCompleted: totalCompleted,
        pendingDeliveries: totalPending,
        overdueDeliveries: totalOverdue,
        totalAssigned: totalAssigned,
        completionRate: completionRate
      },
      completedDeliveries: completedDeliveries.map(order => ({
        id: order._id,
        deliveryName: order.deliveryName,
        address: order.address,
        status: order.status,
        deliveryDate: order.deliveryDate,
        completedAt: order.updatedAt // Use updatedAt as completion time
      })),
      pendingDeliveries: pendingDeliveries.map(order => ({
        id: order._id,
        deliveryName: order.deliveryName,
        address: order.address,
        status: order.status,
        deliveryDate: order.deliveryDate,
        location: order.location
      })),
      overdueDeliveries: overdueDeliveries.map(order => ({
        id: order._id,
        deliveryName: order.deliveryName,
        address: order.address,
        status: order.status,
        deliveryDate: order.deliveryDate,
        location: order.location,
        daysOverdue: Math.floor((currentDate - order.deliveryDate) / (1000 * 60 * 60 * 24))
      }))
    });

  } catch (error) {
    console.error("Error fetching partner delivery stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
