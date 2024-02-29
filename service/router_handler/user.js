// Import the database operation module
const db = require("../db/index");
// Import the package for generating Tokens
const jwt = require("jsonwebtoken");
// Import the global configuration file
const config = require("../config");

// Handler function for registering new users
exports.register = (req, res) => {
  const userinfo = req.query;
  // Validate the data in the form
  if (
    !userinfo.username ||
    !userinfo.password ||
    !userinfo.phone ||
    !userinfo.nickname
  ) {
    return res.send({
      status: 1,
      message: "Please fill in the necessary information!",
    });
  }

  // Define SQL statement to check if the username is taken
  const sqlStr = "select * from t_users where username=?";
  db.query(sqlStr, userinfo.username, (err, results) => {
    // SQL statement execution failed
    if (err) {
      return res.cc(err);
    }
    // Check if the username is taken
    if (results.length > 0) {
      return res.cc("The account is taken, please change to another account!");
    }
    // Define SQL statement to check if the contact method is taken
    const sqlStr = "select * from t_users where phone=?";
    db.query(sqlStr, userinfo.phone, (err, results) => {
      // SQL statement execution failed
      if (err) {
        return res.cc(err);
      }
      // Check if the contact method is taken
      if (results.length >= 1) {
        return res.cc(
          "This contact method has been registered, please log in directly!",
          0
        );
      }
      // Register user
      const addUserSql = "insert into t_users set ?";
      db.query(addUserSql, req.query, (err, results) => {
        // Check if SQL statement execution was successful
        if (err) return res.cc(err);
        // Check if the number of affected rows is 1
        if (results.affectedRows !== 1)
          return res.cc("User registration failed, please try again later!");
        // User registration successful
        res.cc("User registration successful!", 0);
      });
    });
    return;
  });
  return;
};

// Login handler function
exports.login = (req, res) => {
  const userinfo = req.query;
  // Validate the data in the form
  if (!userinfo.username || !userinfo.password) {
    return res.send({
      status: 1,
      message: "Username or password cannot be empty!",
    });
  }

  const sqlStr = "select * from t_users where username=?";
  db.query(sqlStr, userinfo.username, function (err, results) {
    // SQL statement execution failed
    if (err) return res.cc(err);
    // Check if the username exists
    if (results.length !== 1) return res.cc("User does not exist!");
    // Check if the user password is correct
    if (userinfo.password !== results[0].password)
      return res.cc("Wrong password!");
    // Operations upon successful login
    const user = { ...results[0], password: "" };
    // Encrypt user information to generate Token string
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    });
    // Call res.send() to respond the Token to the client
    res.send({
      status: 0,
      message: "Login successful!",
      token: "Bearer " + tokenStr,
    });
  });
  return;
};
