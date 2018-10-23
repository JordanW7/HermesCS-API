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
const requests = require("./controllers/requests");
const newrequest = require("./controllers/newrequest");
const searchrequests = require("./controllers/searchrequests");
const dashboard = require("./controllers/dashboard");
const teams = require("./controllers/teams");

//Change for deploy
const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI
});

//Change for deploy
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

app.get("/profile/:account/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.get("/requests/:account/:id/", auth.requireAuth, (req, res) => {
  requests.handleRequestGet(req, res, db);
});
app.get("/teams/:account", auth.requireAuth, (req, res) => {
  teams.handleTeamsGet(req, res, db);
});
app.get("/dashboard/:account/:user", auth.requireAuth, (req, res) => {
  dashboard.handleDashboardGet(req, res, db);
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
app.post("/addrequestcomments", auth.requireAuth, (req, res) => {
  requests.handleCommentsAdd(req, res, db);
});
app.post("/updaterequest", auth.requireAuth, (req, res) => {
  requests.handleRequestUpdate(req, res, db);
});
app.post("/newrequest", auth.requireAuth, (req, res) => {
  newrequest.handleNewRequest(req, res, db);
});
app.post("/searchrequests", auth.requireAuth, (req, res) => {
  searchrequests.handleSearchRequest(req, res, db);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}.`));
