const express = require("express");
const router = express.Router();
const db = require("../db/index");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

router.post("/", (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log(req.body);
  const sql =
    "INSERT INTO t_messages (name, email, subject, message) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, subject, message], (err, result) => {
    if (err) {
      console.error("Error inserting message into database:", err);
      return res.send({
        status: 1,
        message: "Error inserting message into database",
      });
    }
    console.log("Message inserted into database");
    res.send({
      status: 0,
      message: "Message sent successfully",
    });
  });
});

module.exports = router;
