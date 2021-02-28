const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");

// Create a new team
router.post("/new", async (req, res, next) => {
  try {
    const { team_name, course_id } = req.body;

    // Ensure target team does not exist yet
    let existing_team = await knex("d3l_team")
      .where({
        team_name: team_name,
        course_id: course_id,
      })
      .select("id");

    if (existing_team.length > 0) {
      return res.status(409).json({});
    }

    // Update table
    await knex("d3l_team").insert({
      team_name: team_name,
      course_id: course_id,
    });
    res.status(201).json({});
  } catch (err) {
    next(err);
  }
});

// Delete existing team
router.post("/delete", async (req, res, next) => {
  try {
    const { team_id } = req.body;
    // Update table
    await knex("d3l_team")
      .where({
        id: team_id,
      })
      .del();

    res.status(201).json({});
  } catch (err) {
    next(err);
  }
});

// Add user to a team
router.post("/addUser", async (req, res, next) => {
  try {
    const { user_id, team_id } = req.body;

    // Can't add user if they're already part of target team
    let existing_result = await knex("d3l_user_team")
      .where({
        user_id: user_id,
        team_id: team_id,
      })
      .select();

    if (existing_result.length > 0) {
      res.status(409).json({});
      return;
    }

    // Update team table
    await knex("d3l_user_team").insert({
      user_id: user_id,
      team_id: team_id,
    });

    res.status(201).json({});
  } catch (err) {
    next(err);
  }
});

// Remove user from team
router.post("/deleteUser", async (req, res, next) => {
  try {
    const { user_id, team_id } = req.body;
    // Update team table
    await knex("d3l_user_team")
      .where({
        user_id: user_id,
        team_id: team_id,
      })
      .del();

    res.status(201).json({});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
