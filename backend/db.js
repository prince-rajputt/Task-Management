const { Pool } = require("pg");

const useMemory = process.env.USE_MEMORY === "true";

let pool = null;
if (!useMemory) {
  pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "password",
    database: "taskdb",
    port: 5432,
  });
}

module.exports = { pool, useMemory };
