const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");

// Get all courses
router.get("/getAllCourses", async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);
  try {
    const courses = await knex
      .select(
        "course_id",
        "title",
        "course_number",
        "course_prefix",
        "section_number"
      )
      .from("d3l_course")
      .join("d3l_user_course", "d3l_user_course.course_id", "d3l_course.id")
      .where({ "d3l_user_course.user_id": user.userID });
    res.status(200).json({ courses });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
