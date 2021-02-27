const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");

router.get("/profile", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);

    const [profile] = await knex("d3l_user")
      .where({ id: user.id })
      .select(
        "first_name",
        "last_name",
        "middle_name",
        "id",
        "phone",
        "email",
        "address"
      );
    res.json({ profile });
  } catch (err) {
    next(rrr);
  }
});

// Delete own user account
router.post("/delete", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);

    // Delete from pivot table: "d3l_user_content"
    await knex("d3l_user_content").where({ user_id: user.id }).del();

    // Delete from table: "d3l_discussion_post"
    await knex("d3l_discussion_post").where({ user_id: user.id }).del();

    // Delete from pivot table: "d3l_user_team"
    await knex("d3l_user_team").where({ user_id: user.id }).del();

    // Delete from pivot table: "d3l_user_course"
    await knex("d3l_user_course").where({ user_id: user.id }).del();

    // Delete from pivot table: "d3l_user_role"
    await knex("d3l_user_role").where({ user_id: user.id }).del();

    // If so, update user table via delete
    await knex("d3l_user").where({ id: user.id }).del();
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

const course_routes = require("./course.js");
const content_routes = require("./content.js");
const team_routes = require("./team.js");
const discussion_routes = require("./discussion.js");
const { route } = require("./course.js");

router.use("/course", course_routes);
router.use("/content", content_routes);
router.use("/team", team_routes);
router.use("/discussion", discussion_routes);

// export router
module.exports = router;
