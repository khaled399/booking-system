const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.createBookingValidator = [
  check("service").notEmpty().withMessage("Service is required"),

  check("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO8601 date"),

  validatorMiddleware,
];
