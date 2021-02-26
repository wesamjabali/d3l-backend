const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");

// Get all the relevant fields of a given discussion post (post ID)
router.get("/getDiscussionPost", async (req, res, next) => {
  const { post_id } = req.query;

  try {
    const results = await knex
      .select(["user_id", "course_id", "parent_id", "content_id", "title", "body"])
      .from("d3l_discussion_post")
      .where({ id: post_id });

      res.status(200).json({ results });

  } catch (err) {
    next(err);
  }
});

// Get all discussion posts (post IDs) within a given course
router.get("/getAllByCourse", async (req, res, next) => {
  const { course_id } = req.query;

  try {
      const posts = await knex
        .select("id")
        .from("d3l_discussion_post")
        .where({ course_id: course_id });

      res.status(200).json({ posts });

  } catch (err) {
    next(err);
  }
});

// Get all discussion posts (post IDs) under a given content
router.get("/getAllByContent", async (req, res, next) => {
  const { content_id } = req.query;
  
  try {
      const posts = await knex
        .select("id")
        .from("d3l_discussion_post")
        .where({ content_id: content_id });

      res.status(200).json({ posts });

  } catch (err) {
    next(err);
  }
});

// Get all discussion posts (post IDs) under a given parent post
router.get("/getAllByParent", async (req, res, next) => {
  const { parent_id } = req.query;

  try {
      const posts = await knex
        .select("id")
        .from("d3l_discussion_post")
        .where({ parent_id: parent_id });

      res.status(200).json({ posts });

  } catch (err) {
    next(err);
  }
});

// Get all discussion posts (post IDs) associated with a given user
router.get("/getAllByUser", async (req, res, next) => {
  const { user_id } = req.query;

  try {
    const posts = await knex
      .select("id")
      .from("d3l_discussion_post")
      .where({ user_id: user_id});
    
    res.status(200).json({ posts });

  } catch (err) {
    next(err);
  }
});

// Create a new discussion post
router.post("/new", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);
    const { course_id, parent_id, content_id, title, body } = req.body;

    await knex("d3l_discussion_post").insert({
      user_id: user.id,
      course_id: course_id,
      parent_id: parent_id,
      content_id: content_id,
      title: title,
      body: body
    });

    res.status(201).json({});

  } catch(err) {
    next(err);
  }
});

// Delete a discussion post
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

// Edit a discussion post
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