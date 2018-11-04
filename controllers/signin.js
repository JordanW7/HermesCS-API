const jwt = require("jsonwebtoken");
const redis = require("redis");
//May require changing for deploy.
const redisClient = redis.createClient(process.env.REDIS_URI);

const signToken = (id, account) => {
  const jwtPayload = { id, account };
  return jwt.sign(jwtPayload, "JWT_SECRET_KEY", { expiresIn: "7 days" });
};

const setToken = async (key, account, id) => {
  const setAccount = await redisClient.hset(key, "account", account);
  const setID = await redisClient.hset(key, "id", id);
  return Promise.resolve(setID);
};

const createSession = async (user, account) => {
  try {
    const { id, email } = user;
    const token = signToken(id, account);
    data = await setToken(token, account, id);
    return Promise.resolve({
      success: "true",
      id,
      token,
      email: email.toLowerCase(),
      account
    });
  } catch (err) {
    console.log(err);
  }
};

const handleSignin = async (req, res, db, bcrypt) => {
  const { account, firstname, lastname, email, password } = req.body;
  if (!account || !email || !password) {
    return Promise.reject("incorrect form submission");
  }
  try {
    const data = await db
      .select("email", "hash")
      .from(`${account.toLowerCase()}_users`)
      .where("email", "=", email.toLowerCase());
    const isValid = bcrypt.compareSync(password, data[0].hash);
    if (isValid) {
      const user = await db
        .select("*")
        .from(`${account.toLowerCase()}_users`)
        .where("email", "=", email.toLowerCase());
      if (user[0].status !== "active") {
        console.log("NOT");
        return Promise.reject("not active");
      }
      return Promise.resolve({
        email: user[0].email,
        id: user[0].id,
        account: account
      });
    } else {
      console.log("BAD CRED");
      return Promise.reject("wrong credentials");
    }
  } catch (err) {
    console.log("ERROR");
    return res.status(400).json("unable to get user");
  }
};

const signinAuthentication = async (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  try {
    //Has the person sent a token, if so check the token
    if (authorization) {
      return redisClient.hgetall(authorization, (err, reply) => {
        if (reply) {
          return res.status(200).json(reply);
        } else {
          return res.status(400).json(err);
        }
      });
    }
    //Person has not sent a token, check their credentials
    const data = await handleSignin(req, res, db, bcrypt);
    //If credentials are valid, create a new session.
    if (data.id && data.email && req.body.account) {
      const session = await createSession(data, req.body.account.toLowerCase());
      return res.status(200).json(session);
    }
    return res.json(Promise.reject(data));
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  signinAuthentication: signinAuthentication,
  redisClient: redisClient
};
