const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");

// Get all relevant fields of a given course
router.get("/getCourse", async (req, res, next) => {
  const { course_id } = req.query;

  try {
    const results = await knex
      .select([
        "course_id",
        "title",
        "course_number",
        "course_prefix",
        "section_number",
      ])
      .from("d3l_course")
      .where({ id: course_id });

    res.status(200).json({ results });
  } catch (err) {
    next(err);
  }
});

// Get all courses (course IDs) for the current user
router.get("/getAllCourses", async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);
  try {
    const courses = await knex
      .select("d3l_course.id", "title")
      .from("d3l_course")
      .join("d3l_user_course", "d3l_user_course.course_id", "d3l_course.id")
      .where({ "d3l_user_course.user_id": user.id });
    res.status(200).json({ courses });
  } catch (err) {
    next(err);
  }
});

// Get all users (user IDs) in the current course
router.get("/getAllUsers", async (req, res, next) => {
  const { course_id } = req.query;
  try {
    const users = await knex
      .select("d3l_user.id", "d3l_user.first_name", "d3l_user.last_name")
      .from("d3l_user_course")
      .leftJoin("d3l_user", "d3l_user.id", "d3l_user_course.user_id")
      .where({ course_id: course_id });

    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
