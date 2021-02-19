const express = require("express");
const router = express.Router();
const knex = require("../../../database/knex");

// Add role to user such as admin or faculty.
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

// Get all users
router.get("/getAllUsers", async (req, res, next) => {
  try {
    const users = await knex.select(['id', 'first_name', 'last_name']).from('d3l_user');
    res.status(200).json({ users })
  } catch (err) {
    next(err);
  }
  })

    module.exports = router;