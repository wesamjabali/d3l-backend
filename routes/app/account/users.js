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

// add user
router.post("/", async (req, res, next) => {
    try {     
      const newUser =  {
        first_name,
        last_name,
        email,
        password,
        phone,
        address,
        roles
      } = req.body;
    
      
    
      let bcryptPass = bcrypt.hashSync(newUser.password, salt);
    
      let [existingUser] = await knex("d3l_user")
        .where({
          email: newUser.email
        }).select();
    
        if(typeof existingUser != "undefined") {
          res.status(404).json({});
          throw new Error("Localized - 404");
        }
    
        await knex("d3l_user")
          .insert({
            first_name: newUser.first_name,
            last_name: newUser.lasst_name,            
            email: newUser.email,
            password: bcryptPass,
            phone: newUser.phone,
            address: newUser.address
          }); 
        
      res.status(201).json({});
    } catch (err) {
      next(err)
    }
    
    });

    module.exports = router;