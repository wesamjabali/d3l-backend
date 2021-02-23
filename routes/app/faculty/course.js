const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");

// Get all courses
router.get("/getAllCourses", async (req, res, next) => {
    try {
      const courses = await knex
        .select(["id", "title"])
        .where({'course_id': course_id})
        .from("d3l_course");
      res.status(200).json({ courses });
    } catch (err) {
      next(err);
    }
  });

  

module.exports = router;
