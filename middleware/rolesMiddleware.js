module.exports = (roles = []) => {
    return (req, res, next) => {
      // grab admin roles
      console.log(req);
      const userRoles = req.user.roles;
      // if includes admin, autopass
      if (userRoles.includes("admin")) {
        return next();
      } else {
        // check if admin has any of the roles assigned
        let hasRole = false;
        for (let role of roles) {
          if (userRoles.includes(role)) {
            hasRole = true;
            break;
          }
        }
        // if true proceed, otherwise reject
        console.info("TCL: hasRole", hasRole);
        if (hasRole) {
          next();
        } else {
          // reject otherwise
          res.status(403).json({});
          throw new Error("WARNING! - ADMIN AUTH ROLES ERROR! - 403");
        }
      }
    };
  };