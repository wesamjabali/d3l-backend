const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const knex = require("../../../database/knex");

// get all users
router.get("/getAllUsers", async (req, res, next) => {
try {
  const users = await knex.select().from('users');
  res.status(200).json({ users })
} catch (err) {
  next(err);
}
})

// add user
router.post("/", async (req, res, next) => {
    try {     
      const newUser =  {
        username,
        password,
        payrate,
        roles
      } = req.body;
    
      
    
      let bcryptPass = bcrypt.hashSync(newUser.password, salt);
    
      let [existingUser] = await knex("users")
        .where({
          username: newUser.username
        }).select();
    
        if(typeof existingUser != "undefined") {
          res.status(404).json({});
          throw new Error("Localized - 404");
        }
    
        console.log(existingUser);
        await knex("users")
          .insert({
            username: newUser.username,
            email: newUser.email,
            password: bcryptPass,
            payrate: newUser.payrate,
            roles: newUser.roles
          });
    
      res.status(201).json({});
    } catch (err) {
      next(err)
    }
    
    });

    module.exports = router;