// required modules
const express = require("express");
const router = express.Router();

const user_routes = require("./user.js");
const course_routes = require("./course.js")

router.use("/user", user_routes);
router.use("/course", course_routes);

// export router
module.exports = router;
