const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");

// Delete a discussion post (anyone's)
router.post("/delete", async(req, res, next) => {
  try {
    const { post_id } = req.body;

    await knex("d3l_discussion_post")
      .where({ id: post_id })
      .del();

    res.status(200).json({});

  } catch (err) {
      next(err);
  }
});

// Edit a discussion post (anyone's)
router.post("/edit", async(req, res, next) => {
  try {
    const { post_id, title, body } = req.body;

    await knex("d3l_discussion_post")
      .where({ id: post_id })
      .update({
          title: title,
          body: body
      });
    
      res.status(201).json({});

  } catch (err) {
    next(err);
  }

});

module.exports = router;