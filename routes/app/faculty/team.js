const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");

// New Team:
// get title from frontend
// get course_id from frontend
// check if that team already exists for that course
// if not, create that team
// if so, return 409 error
router.post("/new", async (req, res, next) => {
  try {
    const { team_name, course_id } = req.body;

    let existing_course = await knex("d3l_team")
      .where({
        team_name: team_name,
        course_id: course_id,
      })
      .select("id");

    if (existing_course.length > 0) {
      res.status(409).json({});
      throw new Error("Teams already exists.");
    }

    await knex("d3l_team").insert({
        team_name: team_name,
        course_id: course_id,
    });
    res.status(201).json({});
  } catch (err) {
    next(err);
  }
});

// query courses for associated users include my user id
// if null, return auth error
module.exports = router;
