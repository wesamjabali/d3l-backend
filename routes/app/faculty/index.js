// required modules
const express = require("express");
const router = express.Router();

const user_routes = require("./user.js");

router.use("/user", user_routes);

// export router
module.exports = router;