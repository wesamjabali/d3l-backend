const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");

// Delete own user account
router.post("/deleteSelf", async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);
  
      // If so, update user table via delete
      await knex("d3l_user")
        .where({ id: user.id })
        .del();

      // Delete from pivot table: "d3l_user_content"
      await knex("d3l_user")
        .where({ user_id: user.id })
        .del();

      // Delete from table: "d3l_discussion_post"
      await knex("d3l_discussion_post")
        .where({ user_id: user.id })
        .del();

      // Delete from pivot table: "d3l_user_team"
      await knex("d3l_user_team")
        .where({ user_id: user.id })
        .del();

      // Delete from pivot table: "d3l_user_course"
      await knex("d3l_user_course")
        .where({ user_id: user.id })
        .del();
    
      // Delete from pivot table: "d3l_user_role"
      await knex("d3l_user_role")
        .where({ user_id: user.id })
        .del();
  
      res.status(200).json({});
  
    } catch(err) {
      next(err);
    }
    
  });

  module.exports = router;
