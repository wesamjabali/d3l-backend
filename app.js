require("dotenv").config();
const express = require('express');
const knex = require("./database/knex")

const app = express();

// global middleware
const cors = require("./middleware/cors")

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "40mb" }));
app.use(cors)

// attach main router
const mainRouter = require("./routes")
app.use(mainRouter)

// check
app.all('*', (req, res) => {
    res.status(404).json({})
});

// Start App
// Start App Functions
const startApp = async () => {
    try {
      // Log current migration before StartApp
      const knexMigrationBeforeStartApp = await knex.migrate.currentVersion();
      console.info(
        "startApp -> knexMigrationBeforeStartApp:",
        knexMigrationBeforeStartApp
      );
      // if in staging, restart every time
      if (process.env.NODE_ENV !== "production") {
        await knex.migrate.rollback();
      }
      // migrate latest seed
      await knex.migrate.latest();
      // if no seeds, seed the app
          const result = await knex("d3l_user").select();
          const seedMessage = result.length ? `Already there.` : `Seeding.`;
          console.info("startApp -> seeds:", seedMessage);
          if (result.length === 0) {
            await knex.seed.run();
          }
      // Log current migration after latest triggered
      const knexMigrationAfterStartApp = await knex.migrate.currentVersion();
      console.info(
        "startApp -> knexMigrationAfterStartApp:",
        knexMigrationAfterStartApp
      );
      // set host
      const hostname =
        process.env.NODE_ENV == "development"
          ? "http://localhost:3333"
          : "assigned domain.";
      // Start Message
      const onListening = `
  ----------------------
  App is launched in environment: ${process.env.NODE_ENV} !!!
  and listening on ${hostname}
  ----------------------
  `;
      // Start listening
      app.listen(process.env.PORT || 3333, () => console.info(onListening));
    } catch (err) {
      console.error(err);
    }
  };
  
  startApp();