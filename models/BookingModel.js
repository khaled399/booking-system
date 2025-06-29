const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    service: {
      type: String,
      required: [true, "Booking must have a service"],
    },
    date: {
      type: Date,
      required: [true, "Booking must have a date"],
    },
    status: {
      type: String,
      enum: ["available", "pending", "confirmed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
