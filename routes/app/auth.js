// required modules
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const knex = require("../../database/knex");



// user login
router.post("/login", async (req, res, next) => {
    try {
      // initialize body params
      const {
        username,
        password,
      } = req.body;
      // fetch user details
      const [targetUser] = await knex("users")
        .where({
          username,
        })
        .select();
      // 404 condition
      if (typeof targetUser == "undefined") {
        res.status(404).json({});
        throw new Error("Localized - 404");
      }
      // match passwords then proceed
        const passwordMatching = bcrypt.compareSync(
          password,
          targetUser.password
        );
        if (!passwordMatching) {
          res.status(422).json({});
          throw new Error("Validation Error - 422");
        }
      // create token for user
      const token = jwt.sign(
        {
          userID: targetUser.id,
          username: targetUser.username,
          roles: targetUser.roles,
          payRate: targetUser.payrate,
          iat: Math.floor(Date.now() / 1000),
        },
        process.env.AUTH_CLIENT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      // response logic
      res.status(201).json({
        token,
      });
    } catch (err) {
      next(err);
    }
  });

  module.exports = router;