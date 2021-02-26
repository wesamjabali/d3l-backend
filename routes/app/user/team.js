const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");

// Get all relevant fields for a given team (team ID)
router.get("/getTeam", async (req, res, next) => {
  const { team_id } = req.body;

  try {
    const results = await knex
      .select(["team_name", "course_id"])
      .from("d3l_team")
      .where({ id: team_id });

    res.status(200).json({ results });
  } catch (err) {
    next(err);
  }
});

// Get all teams (team IDs) in a given course
router.get("/getAllForCourse", async (req, res, next) => {
  const { course_id } = req.query;
  try {
    const teams = await knex
      .select("id", "team_name")
      .from("d3l_team")
      .where({ course_id: course_id });

    res.status(200).json({ teams });
  } catch (err) {
    next(err);
  }
});

// Get all users (user IDs) in a given team
router.get("/getAllUsers", async (req, res, next) => {
  const { team_id } = req.body;

  try {
    let ids = await knex
      .select("user_id")
      .from("d3l_user_team")
      .where({ team_id: team_id });

    const users = ids;
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
});

// Get own (current user's) teams (team IDs) in a given course
router.get("/getOwnForCourse", async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);
  var { course_id } = req.query;

  try {
    // Get all teams for the given course
    const [team] = await knex
      .select("d3l_team.id", "d3l_team.team_name")
      .from("d3l_team")
      .join("d3l_user_team", "d3l_user_team.team_id", "d3l_team.id")
      .where({ "d3l_team.course_id": course_id, user_id: user.id });
    // From among the teams in the given course, filter down to
    // only teams that the user is a part of

    res.status(200).json({ team });
  } catch (err) {
    next(err);
  }
});

// Get own (current user's) teams (team IDs) in a given course
router.get("/getUsers", async (req, res, next) => {
  const { team_id } = req.query;
  try {
    // Get all teams for the given course
    const team = await knex
      .select("d3l_user.id", "first_name", "last_name", "email", "phone")
      .from("d3l_user")
      .join("d3l_user_team", "d3l_user_team.user_id", "d3l_user.id")
      .where("d3l_user_team.team_id", team_id);
    // From among the teams in the given course, filter down to
    // only teams that the user is a part of

    res.status(200).json({ team });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
