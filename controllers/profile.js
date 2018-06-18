const handleProfileGet = async (req, res, db) => {
  const { id, account } = req.params;
  try {
    const user = await db
      .select("*")
      .from(`${account.toLowerCase()}_users`)
      .where({ id });
    const dbdata = await db
      .select("*")
      .from("databaselist")
      .where({ account });
    if (user.length && dbdata.length) {
      const response = {
        id: user[0].id,
        email: user[0].email,
        account: dbdata[0].account,
        firstname: user[0].firstname,
        lastname: user[0].lastname,
        access: user[0].access,
        team: user[0].team,
        displayname: dbdata[0].displayname
      };
      res.json(response);
    } else {
      res.status(400).json("Not found");
    }
  } catch (err) {
    res.status(400).json("error getting user");
  }
};

module.exports = {
  handleProfileGet
};
