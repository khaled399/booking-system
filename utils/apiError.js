// utils/apiError.js

// @desc    This class is responsible for operational errors (errors we can predict)
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); // ⬅️ مهم جداً للـ stack trace
  }
}

module.exports = ApiError;
