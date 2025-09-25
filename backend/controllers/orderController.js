import Order from "../models/Order.js";

// @desc    Admin: Create new order
// @route   POST /api/orders
// @access  Admin
export const createOrder = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create orders" });
    }
    console.log(req.body);
    const { deliveryName, address, location, deliveryDate, assignedPartner } =
      req.body;

    if (!deliveryName || !address || !location || !deliveryDate) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }
    const status = assignedPartner ? "assigned" : "pending";
    const order = new Order({
      deliveryName,
      address,
      location,
      deliveryDate,
      assignedPartner,
      status,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Admin: Assign order to partner
// @route   PUT /api/orders/:id/assign
// @access  Admin
export const assignOrder = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can assign orders" });
    }

    const { partnerId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.assignedPartner = partnerId;
    order.status = "assigned";
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Partner: Get my assigned orders
// @route   GET /api/orders/my-orders
// @access  Partner
export const getMyOrders = async (req, res) => {
  try {
    if (req.user.role !== "partner") {
      return res
        .status(403)
        .json({ message: "Only partners can view their orders" });
    }

    const orders = await Order.find({ assignedPartner: req.user._id });
    res.json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Partner: Update order status
// @route   PUT /api/orders/:id/status
// @access  Partner
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.assignedPartner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your order" });
    }

    const { status } = req.body;
    if (!["pending", "assigned", "picked", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};




// ✅ Get all orders with assigned partner ID and name
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("assignedPartner", "name") // only populate the partner's name
      .sort({ createdAt: -1 });

    // Map orders to include assignedPartner id and name explicitly
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      deliveryName: order.deliveryName,
      address: order.address,
      status: order.status,
      deliveryDate: order.deliveryDate,
      location: order.location,
      assignedPartner: order.assignedPartner
        ? { _id: order.assignedPartner._id, name: order.assignedPartner.name }
        : null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};



export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("assignedPartner", "name email _id");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};



export const editOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("assignedPartner", "name email _id");

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};




export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};




