const redisClient = require("./signin").redisClient;

const handleSignout = (req, res) => {
  const { authorization } = req.headers;
  try {
    //Use redis to delete the token
  } catch (err) {
    return res.status(200).json("signout error");
  }
};
