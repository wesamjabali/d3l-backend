// required modules
const express = require("express");
const router = express.Router();

// controller files imports
const appRouter = require("./app");

// routers attached
router.use("/app", appRouter);

// export router
module.exports = router;
