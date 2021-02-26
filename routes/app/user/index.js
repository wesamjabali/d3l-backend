// required modules
const express = require("express");
const router = express.Router();

const course_routes = require("./course.js");
const content_routes = require("./content.js");
const team_routes = require("./team.js");
<<<<<<< HEAD
const discussion_routes = require('./discussion.js');
=======
const user_routes = require("./user.js");
>>>>>>> refs/rewritten/Fix-user-routing-in-user

router.use("/course", course_routes);
router.use("/content", content_routes);
router.use("/team", team_routes);
<<<<<<< HEAD
router.use("./discussion", discussion_routes);
=======
router.user("/user", user_routes);
>>>>>>> refs/rewritten/Fix-user-routing-in-user

// export router
module.exports = router;