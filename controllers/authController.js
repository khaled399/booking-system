// controllers/authController.js
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError("Email is already registered", 400));
  }

  // Create user
  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    status: "success",
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password are provided
  if (!email || !password) {
    return next(new ApiError("Please provide email and password", 400));
  }

  // 2. Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("Invalid email or password", 401));
  }

  // 3. Check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new ApiError("Invalid email or password", 401));
  }

  // 4. Send response with token
  res.status(200).json({
    status: "success",
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    },
  });
});

// @desc    Middleware to protect routes
exports.protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  // 1. التوكن موجود في الهيدر؟
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("You are not logged in, token is missing", 401));
  }

  // 2. تحقق من صحة التوكن
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new ApiError("Invalid token or expired", 401));
  }

  // 3. تأكد إن المستخدم لا يزال موجود
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("User no longer exists", 401));
  }

  // 4. أضف المستخدم للطلب للي بعده
  req.user = currentUser;
  next();
});

// @desc    Restrict access to specific roles

exports.allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to do this operation", 403)
      );
    }
    next();
  };
};
