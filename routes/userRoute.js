const express = require("express");
const {
  getAllUsers,
  getMe,
  deleteUser,
  getUserDashboard,
} = require("../controllers/UserController");
const { protectRoute, allowedTo } = require("../controllers/authController");

const router = express.Router();

router.get("/getMe", protectRoute, getMe);

// Admin only route
router.get("/getAllUsers", protectRoute, allowedTo("admin"), getAllUsers);
router.delete("/deleteUser/:id", protectRoute, allowedTo("admin"), deleteUser);
router.get("/dashboard", protectRoute, allowedTo("user"), getUserDashboard);

module.exports = router;
