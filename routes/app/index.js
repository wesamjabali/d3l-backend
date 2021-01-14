// required modules
const express = require("express");
const router = express.Router();

// controller files imports
const authRoutes = require("./auth");
const accountRoutes = require("./account");

// auth middleware
const authMiddleware = require("../../middleware/authMiddleware")

// routers attached
router.use("/auth", authRoutes);
// protected subrouter
router.use("/account", authMiddleware, accountRoutes)


// export router
module.exports = router;
