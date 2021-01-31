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
      console.log(req.body)
      const attemptUser = {
        email,
        password
      } = req.body;

      // fetch user details
      const [targetUser] = await knex("d3l_user")
        .where({
          email: attemptUser.email
        })
        .select();

      // 404 condition
      if (typeof targetUser == "undefined") {
        res.status(404).json({});
        throw new Error("Localized - 404");
      }
      // match passwords then proceed
        const passwordMatching = bcrypt.compareSync(
          attemptUser.password,
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
          email: targetUser.email,
          iat: Math.floor(Date.now() / 1000),
        },
        process.env.AUTH_CLIENT_SECRET,
        {
          expiresIn: "1h",
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