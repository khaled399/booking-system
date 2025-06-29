const express = require("express");
const router = express.Router();

const {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getAdminDashboard,
  searchBookings,
} = require("../controllers/AdminBookingcontroler");

const { protectRoute, allowedTo } = require("../controllers/authController");

//Protect All routes  only(Admin)

router.use(protectRoute, allowedTo("admin"));

router.get("/dashboard", protectRoute, allowedTo("admin"), getAdminDashboard);

router.get("/", protectRoute, allowedTo("admin"), getAllBookings);
router.patch("/:id", protectRoute, allowedTo("admin"), updateBookingStatus);
router.delete("/:id", protectRoute, allowedTo("admin"), deleteBooking);
router.get("/search", protectRoute, allowedTo("admin"), searchBookings);

module.exports = router;
