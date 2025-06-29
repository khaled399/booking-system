const asyncHandler = require("express-async-handler");
const Booking = require("../models/BookingModel");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Protected (user)
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { service, date, notes } = req.body;

  if (!service || !date) {
    return next(new ApiError("Service and date are required", 400));
  }
  const existing = await Booking.findOne({ date: req.body.date });
  if (existing) {
    return next(new ApiError("This date is already booked", 400));
  }

  const booking = await Booking.create({
    service,
    date,
    notes,
    status: "available",
  });

  res.status(201).json({
    status: "success",
    data: { booking },
  });
});

// @desc    User books an available booking slot
// @route   PATCH /api/bookings/:id/book
// @access  Protected (user)
exports.bookAppointment = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ApiError("Booking slot not found", 404));
  }

  if (booking.user) {
    return next(new ApiError("This slot is already booked", 400));
  }

  // حجز
  booking.user = req.user._id;
  booking.status = "confirmed";
  await booking.save();

  // إرسال إيميل للمستخدم
  const user = await User.findById(req.user._id);

  const message = `Hello ${user.name},\n\nYour appointment for "${booking.service}" has been confirmed on ${booking.date}.\n\nThank you!`;

  await sendEmail({
    email: user.email,
    subject: "Your Appointment is Confirmed ✔️",
    message,
  });

  res.status(200).json({
    status: "success",
    message: "Appointment booked and email sent",
    data: { booking },
  });
});
// @desc    Get all available bookings
// @route   GET /api/bookings/available
// @access  Public or Protected (حسب ما تحب)
exports.getAvailableBookings = asyncHandler(async (req, res) => {
  const availableBookings = await Booking.find({ status: "available" });

  res.status(200).json({
    status: "success",
    results: availableBookings.length,
    data: {
      bookings: availableBookings,
    },
  });
});

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Protected (user)
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id });

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: { bookings },
  });
});

// @desc    Cancel a booking by the logged-in user
// @route   PATCH /api/bookings/:id/cancel
// @access  Protected (user)
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ApiError("Booking not found", 404));
  }

  // Ensure the booking belongs to the logged-in user
  if (!booking.user || booking.user.toString() !== req.user._id.toString()) {
    return next(new ApiError("You can only cancel your own bookings", 403));
  }

  // Prevent canceling if already cancelled or completed
  if (["cancelled", "completed"].includes(booking.status)) {
    return next(new ApiError(`Cannot cancel a ${booking.status} booking`, 400));
  }

  // Reset booking status and remove user association
  booking.status = "available";
  booking.user = undefined;

  await booking.save();

  res.status(200).json({
    status: "success",
    message: "Booking canceled successfully",
    data: { booking },
  });
});
