// required modules
const express = require("express");
const router = express.Router();

// controller files imports
const clockRoutes = require("./clock");
const adminClockRoutes = require("./adminClock");
const userRoutes = require("./user");
const rolesMiddleware = require("../../../middleware/rolesMiddleware");

// routers attached
router.use("/clock", clockRoutes);
router.use("/user", rolesMiddleware(), userRoutes);
router.use("/adminClock", rolesMiddleware(), adminClockRoutes);

// export router
module.exports = router;
