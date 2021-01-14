module.exports = (req, res, next) => {
    // if production env
    // if (process.env.NODE_ENV === "production") {
    //   // if trying to access using default heroku subdomain, reject with error
    //   if (req.headers.host !== "api.rsma.com") {
    //     next(
    //       new Error(
    //         "Suspicious Activity! Trying to access heroku default subdomain!"
    //       )
    //     );
    //   }
    //   // set production cors
    //   const allowedOrigins = ["https://rsma.com", "https://poqw.rsma.com"];
    //   const origin = req.headers.origin;
    //   if (allowedOrigins.indexOf(origin) > -1) {
    //     res.setHeader("Access-Control-Allow-Origin", origin);
    //   }
    // } else {
    //   // if not production, allow any
    //   res.setHeader("Access-Control-Allow-Origin", "*");
    // }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Authorization, Accept, *"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    // intercepts OPTIONS method
    if ("OPTIONS" === req.method) {
      //respond with 200
      res.status(200).json();
    } else {
      //move on
      next();
    }
  };
  