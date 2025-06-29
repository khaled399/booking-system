const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const Booking = require("../models/BookingModel");

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

// @desc    Get all users (admin only)
// @route   GET /api/auth/getAllUsers
// @access  Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
// @desc    Delete user by ID (admin only)
// @route   DELETE /api/auth/deleteUser/:id
// @access  Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});

exports.getUserDashboard = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const totalBookings = await Booking.countDocuments({ user: userId });

  const confirmedBookings = await Booking.countDocuments({
    user: userId,
    status: "confirmed",
  });

  const upcomingBookings = await Booking.find({
    user: userId,
    date: { $gte: new Date() },
  })
    .sort("date")
    .select("service date status"); // اختيار الحقول فقط اللي نعرضها

  res.status(200).json({
    status: "success",
    data: {
      totalBookings,
      confirmedBookings,
      upcomingCount: upcomingBookings.length,
      upcomingBookings, // 👈 هنا بدل latestBooking
    },
  });
});
