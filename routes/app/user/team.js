const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");

// Get all relevant fields for a given team (team ID)
router.get("/getTeam", async(req, res, next) => {
    const { team_id } = req.body;

    try {
        const results = await knex
          .select([
              "team_name",
              "course_id"
          ])
          .from("d3l_team")
          .where( {"id": team_id} );

        res.status(200).json({results});
        
    } catch(err) {
        next(err);
    }
})

// Get all teams (team IDs) in a given course
router.get("/getAllForCourse", async(req, res, next) => {
    const { course_id } = req.body;

    try {
        const teams = await knex
          .select("id")
          .from("d3l_team")
          .where({ "course_id": course_id} );

        res.status(200).json( {contents} );

    } catch (err) {
        next(err);
    }
})

// Get all users (user IDs) in a given team
router.get("/getAllUsers", async(req, res, next) => {
  const { team_id } = req.body;

  try {
    const users = await knex
      .select("user_id")
      .from("d3l_user_team")
      .where( {"team_id": team_id} );

      res.status(200).json( {users} );

  } catch(err) {
      next(err);
  }
});

// Get own (current user's) teams (team IDs) in a given course
router.get("/getOwnForCourse", async(req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);
  const { course_id } = req.body;

  try {
    // Get all teams for the given course as "t_course_teams"
    const subquery1 = await knex
      .select("id")
      .from("d3l_team")
      .where( {"course_id": course_id } )
      .as("t_course_teams");

    // From among the teams in the given course, filter down to
    // only teams that the user is a part of
    const subquery2 = await knex
      .select("id")
      .from(subquery1)
      .join("d3l_user_team", "d3l_user_team.team_id", "t_course_teams.id")
      .where({"d3l_user_team.user_id": user.userID});

    res.status(200).json( {subquery2} );

  } catch(err) {
      next(err);
  }
});

module.exports = router;
