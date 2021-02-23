// required modules
const express = require("express");
const router = express.Router();

const user_routes = require("./user.js");
const course_routes = require("./course.js");
const team_routes = require("./team.js");
const content_routes = require("./content.js");

router.use("/user", user_routes);
router.use("/course", course_routes);
router.use("/team", team_routes);
router.use("/content", content_routes);

// export router
module.exports = router;
