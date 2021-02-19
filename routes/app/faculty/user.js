const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");
// get all users

router.get("/getAllUsers", async (req, res, next) => {
    try {
      const users = await knex.select().from('user');
      res.status(200).json({ users })
    } catch (err) {
      next(err);
    }
    })

router.get("/test", async (req, res, next) => {
    try {
        const message = "Test success! Good job"
        res.status(200).json({ message })
    } catch (err) {
        next(err);
    }
    })

module.exports = router;