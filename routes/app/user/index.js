// required modules
const express = require("express");
const router = express.Router();

const course_routes = require("./course.js");

router.use("/course", course_routes);


// export router
module.exports = router;