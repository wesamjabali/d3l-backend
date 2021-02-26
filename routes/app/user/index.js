// required modules
const express = require("express");
const router = express.Router();

const course_routes = require("./course.js");
const content_routes = require("./content.js");
const team_routes = require("./team.js");
const discussion_routes = require('./discussion.js');
const user_routes = require("./user.js");

router.use("/course", course_routes);
router.use("/content", content_routes);
router.use("/team", team_routes);
router.use("./discussion", discussion_routes);
router.use("/user", user_routes);

// export router
module.exports = router;