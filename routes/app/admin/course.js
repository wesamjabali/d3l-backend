const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");

// Create new course
  router.post("/new", async (req, res, next) => {
    try {
      const {title, course_prefix, course_number, section_number} = req.body;
      
      let existing_course = await knex("d3l_course")
      .where({
        title: title,
        course_prefix: course_prefix,
        course_number: course_number,
        section_number: section_number
      }).select('id');
      console.log(existing_course);
      if(existing_course.length > 0) {
          res.status(409).json({});
          throw new Error("Course already exists.");
      }
      
      await knex("d3l_course").insert({
        title: title,
        course_prefix: course_prefix,
        course_number: course_number,
        section_number: section_number
      })
      res.status(200).json({});
    } catch (err) {
      next(err);
    }
    })

    module.exports = router;