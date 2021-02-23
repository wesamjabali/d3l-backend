const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");

// Create new course
router.post("/new", async (req, res, next) => {
  try {
    const { title, course_prefix, course_number, section_number } = req.body;

    let existing_course = await knex("d3l_course")
      .where({
        course_prefix: course_prefix,
        course_number: course_number,
        section_number: section_number
      })
      .select("id");
      
    if (existing_course.length > 0) {
      res.status(409).json({});
      throw new Error("Course already exists.");
    }

    await knex("d3l_course").insert({
      title: title,
      course_prefix: course_prefix,
      course_number: course_number,
      section_number: section_number,
    });
    res.status(201).json({});
  } catch (err) {
    next(err);
  }
});

// Get all courses
router.get("/getAllCourses", async (req, res, next) => {
  try {
    const courses = await knex
      .select(["id", "title"])
      .from("d3l_course");
    res.status(200).json({ courses });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
