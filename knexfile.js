module.exports = {

  development: {
    client: 'pg',
    connection: "postgres://postgres:postgres@localhost:5432/tempdb",
    migrations: {
      directory: __dirname + "/database/migrations",
    },
    seeds: {
      directory: __dirname + "/database/seeds",
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + "/database/migrations",
    },
    seeds: {
      directory: __dirname + "/database/seeds",
    },
  }
};
