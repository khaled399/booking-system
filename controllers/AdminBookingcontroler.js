const asyncHandler = require("express-async-handler");
const Booking = require("../models/BookingModel");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

// @desc    Get all bookings (Admin only)
// @route   GET /api/admin/bookings/:id
// @access  Protected (admin)
exports.getAllBookings = asyncHandler(async (req, res) => {
  const queryObj = {};

  // فلترة بالتاريخ
  if (req.query.date) {
    const date = new Date(req.query.date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    queryObj.date = {
      $gte: date,
      $lt: nextDay,
    };
  }

  // فلترة بالخدمة
  if (req.query.service) {
    queryObj.service = { $regex: req.query.service, $options: "i" }; // non-case sensitive
  }

  if (req.query.status) {
    queryObj.status = req.query.status;
  }

  const bookings = await Booking.find(queryObj).populate("user", "name email");

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: { bookings },
  });
});

// @desc    Update booking status (Admin only)
// @route   PATCH /api/admin/bookings/:id
// @access  Protected (admin)
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const validStatuses = ["confirmed", "canceled", "pending", "available"];
  if (!validStatuses.includes(status)) {
    return next(new ApiError("Invalid status value", 400));
  }

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!booking) {
    return next(new ApiError("Booking not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { booking },
  });
});

// @desc    Delete a booking (Admin only)
// @route   DELETE /api/admin/bookings/:id
// @access  Protected (admin)
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    return next(new ApiError("Booking not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Booking deleted successfully",
  });
});

// @desc   AdminDashboard (Admin only)
// @route   GET /api/admin/bookings/:id
// @access  Protected (admin)
exports.getAdminDashboard = asyncHandler(async (req, res, next) => {
  const totalBookings = await Booking.countDocuments();
  const confirmedBookings = await Booking.countDocuments({
    status: "confirmed",
  });
  const cancelledBookings = await Booking.countDocuments({
    status: "cancelled",
  });
  const totalUsers = await User.countDocuments();

  res.status(200).json({
    status: "success",
    data: {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalUsers,
    },
  });
});

exports.searchBookings = asyncHandler(async (req, res, next) => {
  const queryObj = {};

  if (req.query.date) {
    queryObj.date = req.query.date;
  }

  if (req.query.service) {
    queryObj.service = req.query.service;
  }

  if (req.query.status) {
    queryObj.status = req.query.status;
  }

  const bookings = await Booking.find(queryObj).populate("user", "name email");

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: {
      bookings,
    },
  });
});
