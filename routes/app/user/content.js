const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");

// Get all the relevant fields of a given piece of content (content ID)
router.get("/getContent", async (req, res, next) => {
  const { content_id } = req.body;

  try {
    const results = await knex
      .select(["course_id", "title", "body", "file_url", "is_graded"])
      .from("d3l_content")
      .where({ id: content_id });

    res.status(200).json({ results });
  } catch (err) {
    next(err);
  }
});

// Get all content (content IDs) within a given course
router.get("/getAllForCourse", async (req, res, next) => {
  const { course_id } = req.query;

  try {
    const contents = await knex
      .select("id")
      .from("d3l_content")
      .where({ course_id: course_id });
    res.status(200).json({ contents });
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

    console.log(result.file_name);
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

// Get own content (content IDs) within a given course
router.get("/getOwnForCourse", async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);
  const { course_id } = req.query;

  try {
    // Get all content for the given course as "t_course_content"
    const subquery1 = await knex
      .select("id")
      .from("d3l_content")
      .where({ course_id: course_id })
      .as("t_course_content");

    // From among the content in the given course, get grade data for current user
    // (i.e. located in pivot table, not content table)
    const subquery2 = await knex
      .select(
        "t_course_content.id",
        "d3l_user_content.points_earned",
        "d3l_user_content.points_total"
      )
      .from(subquery1)
      .join(
        "d3l_user_content",
        "d3l_user_content.content_id",
        "t_course_content.id"
      )
      .where({ "d3l_user_content.user_id": user.id });

    res.status(200).json({ subquery2 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
