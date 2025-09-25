import User from "../models/User.js";
import UserLocation from "../models/UserLocation.js";
// Update availability status
export const updateAvailability = async (req, res) => {
  try {
    const { userId } = req.params; // partner id
    const { availability } = req.body;

    if (typeof availability !== "boolean") {
      return res.status(400).json({ message: "Availability must be true/false" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.availability = availability;
    await user.save();

    res.json({ message: "Availability updated", availability: user.availability });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};






// Get all available partners with their last location
export const getAvailablePartners = async (req, res) => {
  try {
    // Step 1: Find all users who are partners and available
    const partners = await User.find({ role: "partner", availability: true })
      .select("_id name email"); // include email

    // Step 2: For each partner, find their last location
    const results = await Promise.all(
      partners.map(async (partner) => {
        const lastLocation = await UserLocation.findOne({ user: partner._id })
          .sort({ createdAt: -1 }) // get the latest location
          .select("latitude longitude createdAt"); // only select relevant fields

        return {
          id: partner._id,
          name: partner.name,
          email: partner.email,
          lastLocation: lastLocation || null, // null if no location
        };
      })
    );

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




