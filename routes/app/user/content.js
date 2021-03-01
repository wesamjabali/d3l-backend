const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");

// Get all the relevant fields of a given piece of content (content ID)
router.get("/getContent", async (req, res, next) => {
  const { content_id } = req.query;

  try {
    const [content] = await knex
      .select([
        "course_id",
        "title",
        "body",
        "file_url",
        "file_name",
        "points_total",
      ])
      .from("d3l_content")
      .where({ id: content_id });

    res.status(200).json({ content });
  } catch (err) {
    next(err);
  }
});

// Get all the relevant fields of a given piece of content (content ID)
router.get("/getOwn", async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);
  const { content_id } = req.query;
  console.log(req.query);

  try {
    const [content] = await knex
      .select(["id", "course_id", "title", "body", "file_name", "points_total"])
      .from("d3l_content")
      .where({ id: content_id });

    const [grade] = await knex
      .select(["content_id", "points_earned"])
      .from("d3l_user_content")
      .where({
        content_id: content_id,
        user_id: user.id,
      });
    if (grade) {
      content.points_earned = grade.points_earned;
    } else {
      content.points_earned = -1;
    }

    res.status(200).json({ content });
  } catch (err) {
    next(err);
  }
});

// Get all content (content IDs) within a given course (with grades)
router.get("/getAllForCourse", async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);
  const { course_id } = req.query;
  try {
    const content = await knex
      .select(["id", "course_id", "title", "body", "file_name", "points_total"])
      .from("d3l_content")
      .where({ course_id: course_id });
    console.log(content);

    const grades = await knex
      .select(["content_id", "points_earned"])
      .from("d3l_user_content")
      .where({
        course_id: course_id,
        user_id: user.id,
      });
    content.forEach((c) => {
      const grade = grades.find((g) => g.content_id === c.id);
      if (grade) {
        c.points_earned = grade.points_earned;
      } else {
        c.points_earned = -1;
      }
    });
    res.status(200).json({ content });
  } catch (err) {
    next(err);
  }
});

// Get all content grades within a given course
router.get("/getAllGradesForCourse", async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);
  const { course_id } = req.query;
  try {
    const grades = await knex
      .select(["d3l_content.id", "d3l_user_content.points_earned"])
      .from("d3l_content")
      .join("d3l_user_content", "d3l_content.id", "d3l_user_content.content_id")
      .where({
        "d3l_content.course_id": course_id,
        "d3l_user_content.user_id": user.id,
      });
    res.status(200).json({ grades });
  } catch (err) {
    next(err);
  }
});

// Get file blob for content ID
router.get("/getFile", async (req, res, next) => {
  const { content_id } = req.query;

  try {
    const [result] = await knex
      .select("file_url", "file_name")
      .from("d3l_content")
      .where({ id: content_id });

    res.download(result.file_url, result.file_name);

    res.status(200);
  } catch (err) {
    next(err);
  }
});

// Get file name
router.get("/getFileName", async (req, res, next) => {
  const { content_id } = req.query;

  try {
    const [result] = await knex
      .select("file_name")
      .from("d3l_content")
      .where({ id: content_id });

    res.json({ name: result.file_name });

    res.status(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
