const handleTeamsGet = async (req, res, db) => {
  const { account } = req.params;
  try {
    const request = await db.select("*").from(`${account.toLowerCase()}_teams`);
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
  handleTeamsGet
};
