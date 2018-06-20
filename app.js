// require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");

let dump = require("pg");
const app = express();

const auth = require("./controllers/auth");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const signout = require("./controllers/signout");
const profile = require("./controllers/profile");

const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI
});

const whitelist = ["http://localhost:3001"];
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(morgan("combined"));
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  res.status(200).send("Hello World!");
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.post("/signin", (req, res) => {
  signin.signinAuthentication(req, res, db, bcrypt);
});
app.post("/signout", auth.requireAuth, (req, res) => {
  signout.handleSignout(req, res);
});
app.get("/profile/:account/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}.`));
