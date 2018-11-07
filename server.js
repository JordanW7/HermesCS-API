const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");
const { check, oneOf, validationResult } = require("express-validator/check");

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
const contact = require("./controllers/contact");

const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL
});

const whitelist = [
  "https://hermescs-53659.firebaseapp.com",
  "https://hermescs.xyz"
];
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
      // callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(morgan("combined"));
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get(
  "/profile/:account/:id",
  auth.requireAuth,
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("id")
      .trim()
      .not()
      .isEmpty()
      .isInt()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    profile.handleProfileGet(req, res, db);
  }
);

app.get(
  "/notifications/:account/:assign_person",
  auth.requireAuth,
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("assign_person")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    notifications.handleNotificationsGet(req, res, db);
  }
);

app.get(
  "/notifications-team/:account/:assign_team",
  auth.requireAuth,
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("assign_team")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    notifications.handleNotificationsTeamGet(req, res, db);
  }
);

app.get(
  "/requests/:account/:id/",
  auth.requireAuth,
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("id")
      .trim()
      .not()
      .isEmpty()
      .isInt()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    requests.handleRequestGet(req, res, db);
  }
);

app.get(
  "/teams/:account",
  auth.requireAuth,
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    teams.handleTeamsGet(req, res, db);
  }
);

app.get(
  "/users/:account",
  auth.requireAuth,
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    users.handleUsersGet(req, res, db);
  }
);

app.get(
  "/users/:account/:team",
  auth.requireAuth,
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("team")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    users.handleTeamUsersGet(req, res, db);
  }
);

app.post(
  "/register",
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("firstname")
      .trim()
      .not()
      .isEmpty()
      .isAlpha()
      .escape(),
    check("lastname")
      .trim()
      .not()
      .isEmpty()
      .isAlpha()
      .escape(),
    check("email")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    check("password")
      .trim()
      .not()
      .isEmpty()
      .not()
      .isAlpha()
      .not()
      .isInt()
      .isLength({ min: 8, max: undefined })
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    register.handleRegister(req, res, db, bcrypt);
  }
);

app.post(
  "/signin",
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("email")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    check("password")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    signin.handleSignin(req, res, db, bcrypt);
  }
);

app.post(
  "/auth",
  [
    check("authorization")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    signin.handleAuth(req, res, db, bcrypt);
  }
);

app.post(
  "/forgot",
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("email")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    forgot.handleForgotPassword(req, res, db, bcrypt);
  }
);

app.post(
  "/forgotcodesubmit",
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("email")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    check("newpassword")
      .trim()
      .not()
      .isEmpty()
      .not()
      .isAlpha()
      .not()
      .isInt()
      .isLength({ min: 8, max: undefined })
      .escape(),
    check("code")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    forgot.handleForgotPasswordCodeSubmit(req, res, db, bcrypt);
  }
);

app.post(
  "/contact",
  [
    check("account")
      .trim()
      .escape(),
    check("email")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    check("details")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("name")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    contact.handleContact(req, res, db);
  }
);

app.post(
  "/signout",
  auth.requireAuth,
  [
    check("authorization")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    signout.handleSignout(req, res);
  }
);

app.post(
  "/addrequestcomments",
  auth.requireAuth,
  [
    check("id")
      .trim()
      .not()
      .isEmpty()
      .isInt()
      .escape(),
    check("comments")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("user")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("team")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    requests.handleCommentsAdd(req, res, db);
  }
);

app.post(
  "/updaterequest",
  auth.requireAuth,
  [
    check("id")
      .trim()
      .not()
      .isEmpty()
      .isInt()
      .escape(),
    check("userfirstname")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("userlastname")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("userteam")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("assign_team")
      .trim()
      .escape(),
    check("assign_person")
      .trim()
      .escape(),
    check("status")
      .trim()
      .isIn(["unassigned", "current", "complete", ""])
      .escape(),
    check("priority")
      .trim()
      .isIn(["low", "medium", "high", "extreme", ""])
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    requests.handleRequestUpdate(req, res, db);
  }
);

app.post(
  "/newrequest",
  auth.requireAuth,
  [
    check("firstname")
      .trim()
      .escape(),
    check("lastname")
      .trim()
      .escape(),
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("customer_account")
      .trim()
      .escape(),
    check("mobile")
      .trim()
      .escape(),
    check("home")
      .trim()
      .escape(),
    check("twitter")
      .trim()
      .escape(),
    check("facebook")
      .trim()
      .escape(),
    oneOf([check("email").isEmpty(), check("email").isEmail()]),
    check("email")
      .trim()
      .normalizeEmail()
      .escape(),
    check("address")
      .trim()
      .escape(),
    check("type")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("topic")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("assign_team")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("assign_person")
      .trim()
      .escape(),
    check("status")
      .trim()
      .not()
      .isEmpty()
      .isIn(["unassigned", "current", "complete"])
      .escape(),
    check("priority")
      .trim()
      .not()
      .isEmpty()
      .isIn(["low", "medium", "high", "extreme"])
      .escape(),
    check("details")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("created_by")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    newrequest.handleNewRequest(req, res, db);
  }
);

app.post(
  "/searchrequests",
  auth.requireAuth,
  [
    check("firstname")
      .trim()
      .escape(),
    check("lastname")
      .trim()
      .escape(),
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("customer_account")
      .trim()
      .escape(),
    check("mobile")
      .trim()
      .escape(),
    check("home")
      .trim()
      .escape(),
    check("twitter")
      .trim()
      .escape(),
    check("facebook")
      .trim()
      .escape(),
    check("email")
      .trim()
      .normalizeEmail()
      .escape(),
    check("address")
      .trim()
      .escape(),
    check("type")
      .trim()
      .escape(),
    check("topic")
      .trim()
      .escape(),
    check("assign_team")
      .trim()
      .escape(),
    check("assign_person")
      .trim()
      .escape(),
    check("status")
      .trim()
      .isIn(["unassigned", "current", "complete", "", "%"])
      .escape(),
    check("priority")
      .trim()
      .isIn(["low", "medium", "high", "extreme", "", "%"])
      .escape(),
    check("created_by")
      .trim()
      .escape(),
    check("date_range")
      .trim()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    searchrequests.handleSearchRequest(req, res, db);
  }
);

app.post(
  "/notifications",
  auth.requireAuth,
  [
    check("id")
      .trim()
      .not()
      .isEmpty()
      .isInt()
      .escape(),
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("assign_person")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    notifications.handleNotificationsDel(req, res, db);
  }
);

app.post(
  "/settings/updateprofile",
  auth.requireAuth,
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("email")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    check("currentPassword")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("newPassword")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    settings.handleUpdateProfile(req, res, db, bcrypt);
  }
);

app.post(
  "/settings/addteam",
  auth.requireAuth,
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("user")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    check("team")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("leader")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("leaderemail")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    settings.handleAddTeam(req, res, db);
  }
);

app.post(
  "/settings/modifyteam",
  auth.requireAuth,
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("user")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    check("team")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("leader")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    settings.handleModifyTeam(req, res, db);
  }
);

app.post(
  "/settings/deleteteam",
  auth.requireAuth,
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("user")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    check("team")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    settings.handleDeleteTeam(req, res, db);
  }
);

app.post(
  "/settings/adduser",
  auth.requireAuth,
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("user")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    check("newuserfirstname")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("newuserlastname")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("team")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("email")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    check("password")
      .trim()
      .not()
      .isEmpty()
      .not()
      .isAlpha()
      .not()
      .isInt()
      .isLength({ min: 8, max: undefined })
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    settings.handleAddUser(req, res, db, bcrypt);
  }
);

app.post(
  "/settings/modifyuser",
  auth.requireAuth,
  [
    check("account")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("user")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    check("modifyuser")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    check("fullname")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("team")
      .trim()
      .not()
      .isEmpty()
      .escape(),
    check("status")
      .trim()
      .not()
      .isEmpty()
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    settings.handleModifyUser(req, res, db);
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}.`));
