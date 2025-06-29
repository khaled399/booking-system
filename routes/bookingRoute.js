const express = require("express");
const { createBookingValidator } = require("../validators/bookingValidator");

const {
  createBooking,
  bookAppointment,
  getAvailableBookings,
  getMyBookings,
  cancelBooking,
} = require("../controllers/bookingController");
const { protectRoute, allowedTo } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/",
  protectRoute,
  allowedTo("admin", "manager"), // 👈 بس admin و manager يضيفوا مواعيد
  createBookingValidator,
  createBooking
);
router.patch("/:id/book", protectRoute, allowedTo("user"), bookAppointment);
router.get("/available", getAvailableBookings);
router.get("/my-bookings", protectRoute, allowedTo("user"), getMyBookings);
router.patch("/:id/cancel", protectRoute, allowedTo("user"), cancelBooking);

module.exports = router;
