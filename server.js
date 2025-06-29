const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });
const dbConnection = require("./config/database");
const globalError = require("./middlewares/errorMiddleware");
const ApiError = require("./utils/apiError");
//routes
const authRoute = require("./routes/authRoute");
const userroute = require("./routes/userRoute");
const bookingRoute = require("./routes/bookingRoute");
const adminBookingRoute = require("./routes/adminBookingRoute");

dbConnection();

const app = express();

// Middleware to parse JSON

app.use(express.json());

//mount routes
app.use("/api/auth", authRoute);
app.use("/api/user", userroute);
app.use("/api/bookings", bookingRoute);
app.use("/api/admin/bookings", adminBookingRoute);

// Route to trigger 404 error
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
