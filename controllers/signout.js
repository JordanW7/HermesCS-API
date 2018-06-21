const redisClient = require("./signin").redisClient;

const handleSignout = async (req, res) => {
  const { authorization } = req.headers;
  try {
    const response = await redisClient.del(authorization);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(200).json("signout error");
  }
};
