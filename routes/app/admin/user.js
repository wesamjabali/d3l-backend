const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");

router.post("/addRole", async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    const roles = req.body.roles;

    let userID = await knex("d3l_user")
    .where({
      email: userEmail
    }).select('id');
    
    for(const r of roles) {
      await knex("d3l_user_role")
      .insert({
        user_id: userID,
        role: r
      });  
    }
  } catch (err) {
    next(err);
  }
  })

  router.get("/test", async (req, res, next) => {
    try {
        const message = "You have Admin role!"
        res.status(200).json({ message })
    } catch (err) {
        next(err);
    }
    })

    module.exports = router;