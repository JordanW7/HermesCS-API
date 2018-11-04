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
const notifications = require("./controllers/notifications");
const teams = require("./controllers/teams");
const users = require("./controllers/users");
const settings = require("./controllers/settings");
const forgot = require("./controllers/forgot");

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
app.get(
  "/notifications/:account/:assign_person",
  auth.requireAuth,
  (req, res) => {
    notifications.handleNotificationsGet(req, res, db);
  }
);
app.get(
  "/notifications-team/:account/:assign_team",
  auth.requireAuth,
  (req, res) => {
    notifications.handleNotificationsTeamGet(req, res, db);
  }
);
app.get("/requests/:account/:id/", auth.requireAuth, (req, res) => {
  requests.handleRequestGet(req, res, db);
});
app.get("/teams/:account", auth.requireAuth, (req, res) => {
  teams.handleTeamsGet(req, res, db);
});
app.get("/users/:account", auth.requireAuth, (req, res) => {
  users.handleUsersGet(req, res, db);
});
app.get("/users/:account/:team", auth.requireAuth, (req, res) => {
  users.handleTeamUsersGet(req, res, db);
});
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.post("/signin", (req, res) => {
  signin.signinAuthentication(req, res, db, bcrypt);
});
app.post("/forgot", auth.requireAuth, (req, res) => {
  forgot.handleForgotPassword(req, res, db, bcrypt);
});
app.post("/forgotcodesubmit", auth.requireAuth, (req, res) => {
  forgot.handleForgotPasswordCodeSubmit(req, res, db, bcrypt);
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
app.post("/notifications", auth.requireAuth, (req, res) => {
  notifications.handleNotificationsDel(req, res, db);
});
app.post("/settings/updateprofile", auth.requireAuth, (req, res) => {
  settings.handleUpdateProfile(req, res, db, bcrypt);
});
app.post("/settings/addteam", auth.requireAuth, (req, res) => {
  settings.handleAddTeam(req, res, db);
});
app.post("/settings/modifyteam", auth.requireAuth, (req, res) => {
  settings.handleModifyTeam(req, res, db);
});
app.post("/settings/deleteteam", auth.requireAuth, (req, res) => {
  settings.handleDeleteTeam(req, res, db);
});
app.post("/settings/adduser", auth.requireAuth, (req, res) => {
  settings.handleAddUser(req, res, db, bcrypt);
});
app.post("/settings/modifyuser", auth.requireAuth, (req, res) => {
  settings.handleModifyUser(req, res, db);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}.`));
