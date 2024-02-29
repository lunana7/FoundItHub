const mysql = require("mysql");

const db = mysql.createPool({
  host: "",
  user: "",
  password: "",
  port: "",
  database: "",
  timezone: "",
});

module.exports = db;
