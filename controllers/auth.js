const redisClient = require("./signin").redisClient;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send("Unauthorized");
  }
  return redisClient.hgetall(authorization, (err, reply) => {
    if (err || !reply) {
      if (err) {
        console.log(err);
      }
      return res.status(401).send("Unauthorized");
    }
    return next();
  });
};

module.exports = {
  requireAuth
};
