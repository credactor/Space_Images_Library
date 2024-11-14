const knex = require("knex");
require("dotenv").config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, PROD } = process.env;

module.exports = {
  db: knex({
    client: "pg",
    connection: {
      host: PGHOST,
      port: PGPORT,
      user: PGUSER,
      database: PGDATABASE,
      password: PGPASSWORD,
      ssl: { rejectUnauthorized: false },
      // ssl: PROD ? false : { rejectUnauthorized: false },
    },
  }),
};
