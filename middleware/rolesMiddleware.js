const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
  
    return (req, res, next) => {
      // grab admin roles
      if(!req.headers.authorization) {
        res.status(401).json({"401": "User not logged in."});
        throw new Error("User not logged in.");
      }
      const token = req.headers.authorization.split(' ')[1];
      const user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);
      
      const userRoles = user.roles;
      // if includes admin, autopass
      if (userRoles.includes("admin")) {
        return next();
      } else {
        // check if user has any of the roles assigned
        let hasRole = false;
        for (let role of roles) {
          if (userRoles.includes(role)) {
            hasRole = true;
          }
        }
        // if true proceed, otherwise reject
        console.info("TCL: hasRole", hasRole);
        if (hasRole) {
          next();
        } else {
          // reject otherwise
          res.status(403).json({});
        }
      }
    };
  };