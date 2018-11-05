const handleUsersGet = async (req, res, db) => {
  const { account } = req.params;
  try {
    const request = await db
      .select("firstname", "lastname", "email", "team", "access", "status")
      .from(`${account.toLowerCase()}_users`);
    if (request.length) {
      res.json(request);
    } else {
      res.status(400).json("Not found");
    }
  } catch (err) {
    res.status(400).json("error getting request");
  }
};

const handleTeamUsersGet = async (req, res, db) => {
  const { account, team } = req.params;
  try {
    const request = await db
      .select("*")
      .where({ team })
      .from(`${account.toLowerCase()}_users`);
    if (request.length) {
      res.json(request);
    } else {
      res.status(400).json("Not found");
    }
  } catch (err) {
    res.status(400).json("error getting request");
  }
};

module.exports = {
  handleUsersGet,
  handleTeamUsersGet
};
