const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { route } = require("../user/content");
const baseURL = "public/data/uploads/content/";

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, baseURL);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
var upload = multer({
  storage: storage,
});

// New Content
router.post("/new", upload.single("content_file"), async (req, res, next) => {
  try {
    const { course_id, title, body, points_total } = req.body;

    const file = req.file;
    let oldPath = baseURL + file.originalname;
    let courseDir = baseURL + course_id + "/";
    let newPath = courseDir + file.originalname;

    // Check if file exists
    fs.access(newPath, (err) => {
      if (!err) {
        return res.sendStatus(409);
      }
    });
    // TODO: Check why this code runs no matter what I do
    // Create the folder if it doesn't exist
    // Not recommended to hit this point as the move op can be unreliable afterwards.
    fs.mkdir(courseDir, () => {});

    // Move file to its folder.
    fs.rename(oldPath, newPath, () => {});

    // Update d3l_content table
    await knex("d3l_content").insert({
      course_id: course_id,
      title: title,
      body: body,
      file_url: newPath,
      file_name: file.originalname,
      points_total: points_total,
    });
    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
});

// Grade a content
router.post("/grade", async (req, res, next) => {
  try {
    const { content_id, user_id, points_earned, course_id } = req.body;

    await knex("d3l_user_content").insert({
      content_id: content_id,
      course_id: course_id,
      user_id: user_id,
      points_earned: points_earned,
    });
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
});

// Delete content
router.post("/delete", async (req, res, next) => {
  try {
    const { content_id } = req.body;
    // Update content table via delete
    await knex("d3l_content")
      .where({
        id: content_id,
      })
      .del();

    res.status(201).json({});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
