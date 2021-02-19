const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");

// Add user to a course
router.post("/addUserCourse", async (req, res, next) => {
    try {
      const {user_id, course_id} = req.body;
      let course = await knex.select().from('d3l_user_course');
      if(course) {
        res.status(201).json({"message": "Course already exists for this user."})
        next();
      }

      await knex.insert({user_id: user_id, course_id: course_id}).into('d3l_user_course');
      res.status(200).json({ users })
    } catch (err) {
      next(err);
    }
    })

router.get("/test", async (req, res, next) => {
    try {
        const message = "You have at least Faculty role!"
        res.status(200).json({ message })
    } catch (err) {
        next(err);
    }
    })

module.exports = router;