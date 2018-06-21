const handleRegister = async (req, res, db, bcrypt) => {
  const { account, firstname, lastname, email, password } = req.body;
  if (!account || !firstname || !lastname || !email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  try {
    const acctrx = await db.transaction(trx => {
      return trx
        .insert({
          displayname: account,
          account: account.toLowerCase(),
          owner: email.toLowerCase(),
          created_at: new Date()
        })
        .into("databaselist");
    });
    const addRequestsTable = await db.schema.createTable(
      `${account.toLowerCase()}_requests`,
      table => {
        table.increments();
        table.string("firstname");
        table.string("lastname");
        table.string("account");
        table.string("mobile");
        table.string("home");
        table.string("twitter");
        table.string("facebook");
        table.string("email");
        table.string("address");
        table.string("type");
        table.string("topic");
        table.string("assign_person");
        table.string("assign_team");
        table.string("priority");
        table.string("details");
        table.string("attachments");
        table.string("status");
        table.string("comments");
        table.string("user");
        table.timestamps();
      }
    );
    const addUserTable = await db.schema.createTable(
      `${account.toLowerCase()}_users`,
      table => {
        table.increments();
        table.string("firstname");
        table.string("lastname");
        table.string("email");
        table.string("hash");
        table.string("access");
        table.string("team");
      }
    );
    const usertrx = await db.transaction(trx => {
      const hash = bcrypt.hashSync(password);
      return trx
        .insert({
          firstname: firstname,
          lastname: lastname,
          email: email.toLowerCase(),
          hash: hash,
          access: "admin",
          team: "Customer Services"
        })
        .into(`${account.toLowerCase()}_users`);
    });
    const addTeamTable = await db.schema.createTable(
      `${account.toLowerCase()}_teams`,
      table => {
        table.increments();
        table.string("team");
        table.string("leader");
        //maybe need to use table.specificType(name, type) here - to test
        table.string("members");
        table.string("assignments");
      }
    );
    const teamtrx = await db.transaction(trx => {
      return trx
        .insert({
          team: account,
          leader: `${firstname} ${lastname}`,
          //This line also needs testing for array
          members: `{{'${firstname} ${lastname}','${email.toLowerCase()}'}}`
        })
        .into(`${account.toLowerCase}_teams`);
    });
    res.status(200).json(account);
  } catch (err) {
    console.log(err);
    res.status(400).json("unable to register");
  }
};

module.exports = {
  handleRegister: handleRegister
};
