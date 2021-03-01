const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");

// Get all relevant fields of a given course
router.get("/get", async (req, res, next) => {
  const { course_id } = req.query;

  try {
    const [course] = await knex
      .select(["title", "course_number", "course_prefix", "section_number"])
      .from("d3l_course")
      .where({ id: course_id });

    res.status(200).json({ course });
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
      .select(
        "d3l_course.id",
        "title",
        "course_number",
        "course_prefix",
        "section_number"
      )
      .from("d3l_course")
      .join("d3l_user_course", "d3l_user_course.course_id", "d3l_course.id")
      .where({ "d3l_user_course.user_id": user.id });
    res.status(200).json({ courses });
  } catch (err) {
    next(err);
  }
});

// Check if a user belongs to a course.
router.get("/belongs", async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);
  const { course_id } = req.query;

  try {
    const courses = await knex
      .select("id")
      .from("d3l_user_course")
      .where({ user_id: user.id, course_id: course_id });

    if (courses.length == 0) {
      return res.status(200).json({ value: false });
    } else {
      return res.status(200).json({ value: true });
    }
  } catch (err) {
    next(err);
  }
});

// Get all users (user IDs) in the current course
router.get("/getAllUsers", async (req, res, next) => {
  const { course_id } = req.query;
  try {
    const users = await knex
      .select("d3l_user.id", "d3l_user.first_name", "d3l_user.last_name", "d3l_user.email", "d3l_user.phone")
      .from("d3l_user_course")
      .leftJoin("d3l_user", "d3l_user.id", "d3l_user_course.user_id")
      .where({ course_id: course_id });

    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
