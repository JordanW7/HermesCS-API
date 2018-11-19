const handleRegister = async (req, res, db, bcrypt) => {
  const { account, firstname, lastname, email, password } = req.body;
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
  } catch (err) {
    res.status(400).json("account exists");
  }
  try {
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
        table.string("status");
        table.string("comments");
        table.string("created_by");
        table.timestamps("created_at");
      }
    );
    const addNotificationsTable = await db.schema.createTable(
      `${account.toLowerCase()}_notifications`,
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
        table.string("status");
        table.string("comments");
        table.string("created_by");
        table.timestamps("created_at");
        table.string("reference");
        table.string("alert_time");
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
        table.string("status");
        table.string("forgotcode");
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
          access: "owner",
          team: "Customer Services",
          status: "active"
        })
        .into(`${account.toLowerCase()}_users`);
    });
    const addTeamMemberTable = await db.schema.createTable(
      `${account.toLowerCase()}_teams`,
      table => {
        table.increments();
        table.string("team");
        table.string("leader");
        table.specificType("members", "TEXT[]");
      }
    );
    const teamtrx = await db.transaction(trx => {
      return trx
        .insert({
          team: "Customer Services",
          leader: `${firstname} ${lastname}`
        })
        .into(`${account.toLowerCase()}_teams`);
    });
    const teammembertrx = await db.transaction(trx => {
      return trx
        .where("team", "Customer Services")
        .update({
          members: [`${firstname} ${lastname}`]
        })
        .into(`${account.toLowerCase()}_teams`);
    });
    res.status(200).json("success");
  } catch (err) {
    console.log(err);
    res.status(400).json("unable to register");
  }
};

module.exports = {
  handleRegister
};
