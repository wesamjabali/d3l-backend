const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
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
    const { course_id, title, body, is_graded } = req.body;

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
      is_graded: is_graded,
    });
    return res.sendStatus(201);
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
