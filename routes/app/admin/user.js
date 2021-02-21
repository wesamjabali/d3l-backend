const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");

// Add role to user such as admin or faculty.
router.post("/addRole", async (req, res, next) => {
  try {
    const user_id = req.body.user_id;
    const roles = req.body.roles;
    for (const r of roles) {
      let existing_result = await knex("d3l_user_role").where({
        user_id: user_id,
        role: r
      }).select();

      if(existing_result.length > 0) {
        res.status(409).json({});
        return;
      }

      await knex("d3l_user_role").insert({
        user_id: user_id,
        role: r,
      });
    }
    res.status(201).json({});
  } catch (err) {
    next(err);
  }
});

// Add user to a course
router.post("/addCourse", async (req, res, next) => {
  try {
    const { user_id, courses } = req.body;
    for (const c of courses) {
      let existing_result = await knex("d3l_user_course")
        .where({
          user_id: user_id,
          course_id: c,
        })
        .select();

      if (existing_result.length > 0) {
        res.status(409).json({});
        return;
      }

      await knex("d3l_user_course").insert({
        user_id: user_id,
        course_id: c,
      });
    }
    res.status(201).json({});
  } catch (err) {
    next(err);
  }
});

// Get all users
router.get("/getAllUsers", async (req, res, next) => {
  try {
    const users = await knex
      .select(["id", "first_name", "last_name"])
      .from("d3l_user");
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
