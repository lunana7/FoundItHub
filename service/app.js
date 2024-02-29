const joi = require("joi");
const express = require("express");
const app = express();
const cors = require("cors");
const expressJWT = require("express-jwt");
const config = require("./config");

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] })
);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") return res.cc("Authentication failed!");
  next(err);
});

const userRouter = require("./router/user");
app.use("/api", userRouter);

const publicRouter = require("./router/public");
app.use("/api/public", publicRouter);

const userinfoRouter = require("./router/userinfo");
app.use("/my", userinfoRouter);

const adminRouter = require("./router/admin");
app.use("/admin", adminRouter);

app.listen(3007, () => {
  console.log("api server running at http://127.0.0.1:3007");
});
