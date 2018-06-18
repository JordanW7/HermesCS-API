const jwt = require('jsonwebtoken');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URI);

const signToken = (id,account) => {
  const jwtPayload = { id, account };
  return jwt.sign(jwtPayload, 'JWT_SECRET_KEY', { expiresIn: '7 days'});
}

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const createSession = async (user, account) => {
  try {
    const { email, id } = user;
    const token = signToken(id,account);
    data = await setToken(token, `${account}_${id}`)
    return Promise.resolve({ success: 'true', id, token, email, account });
  } catch(err) {
    console.log(err)
  }
}

const handleSignin = async (db, bcrypt, req, res) => {
  const { account, firstname, lastname, email, password } = req.body;
  if (!account || !email || !password) {
    return Promise.reject('incorrect form submission');
  }
  try {
    const data = await db.select('email', 'hash').from(`${account.toLowerCase()}_users`).where('email', '=', email)
    const isValid = bcrypt.compareSync(password, data[0].hash);
    if (isValid) {
      const user = await db.select('*').from(`${account.toLowerCase()}_users`).where('email', '=', email)
      return Promise.resolve({ email: user[0].email, id: user[0].id, account: account })
    }
    else {
      return Promise.reject('wrong credentials');
    }
  } catch(err) {
    return res.status(400).json('unable to get user');
  }
}

const signinAuthentication = async (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  //Has the person got a token, if so check the token before checking credentials
  if (authorization) { 
    redisClient.get(authorization, (err, reply) => {
      if (reply) { return res.json({reply}) }
    });
  }
  //Person has not got a valid token, check their credentials
  try {
    const data = await handleSignin(db, bcrypt, req, res);
    //If credentials are valid, create a new session. Otherwise, reject.
    if (data.id && data.email && req.body.account) { 
      const session = await createSession(data, req.body.account);
      return res.status(200).json(session)
    }
    return res.json(Promise.reject(data))
  } catch (err) {
    res.status(400).json(err)
  }
}

module.exports = {
  signinAuthentication: signinAuthentication,
  redisClient: redisClient
}