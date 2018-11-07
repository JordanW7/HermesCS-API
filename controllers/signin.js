const jwt = require("jsonwebtoken");
const redis = require("redis");
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
  const { account, email, password } = req.body;
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
        return res.status(400).json("not active");
      }
      const data = {
        email: user[0].email,
        id: user[0].id,
        account: account
      };
      const session = await createSession(data, account.toLowerCase());
      return res.status(200).json(session);
    }
    return res.status(400).json("wrong credentials");
  } catch (err) {
    return res.status(400).json("unable to get user");
  }
};

const handleAuth = async (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  try {
    return redisClient.hgetall(authorization, (err, reply) => {
      if (reply) {
        return res.status(200).json(reply);
      } else {
        return res.status(400).json("error");
      }
    });
  } catch (err) {
    res.status(400).json("error");
  }
};

module.exports = {
  handleAuth,
  handleSignin,
  redisClient
};
