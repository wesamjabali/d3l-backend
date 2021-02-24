const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");

// New Content
router.post("/new", async (req, res, next) => {
  try {
    const { course_id, title, body, file_url, is_graded } = req.body;

    // Update d3l_content table
    await knex("d3l_content").insert({
        course_id: course_id,
        title: title,
        body: body,
        file_url: file_url,
        is_graded: is_graded
    });

    res.status(201).json({});

  } catch (err) {
    next(err);
  }
});

// Delete content
router.post("/delete", async (req, res, next) => {
  try {
    const { content_id } = req.body;

    /*
    // Ensure content exists before deleting
    let existing_content = await knex("d3l_content")
      .where({
          id: content_id
      }).select();

    if (existing_content.length == 0) {
        res.status(409).json({});
        throw new Error("Cannot delete nonexistent content.");
    }
    */

    // Update content table via delete
    await knex("d3l_content")
      .where({
          id: content_id
      }).del();

    res.status(201).json({});

  } catch(err) {
      next(err);
  }
});

module.exports = router;
