const checkUserAccess = async (account, user) => {
  if (!account || !user) {
    return "invalid request";
  }
  try {
    const userdetails = user.match(/\S+/g);
    const access = await db
      .select("access")
      .from(`${account.toLowerCase()}_users`)
      .where({ firstname: userdetails[0] })
      .where({ lastname: userdetails[1] });
    return access;
  } catch (err) {
    return "error";
  }
};

const handleUpdateProfile = async (req, res, db, bcrypt) => {
  const { currentPassword, newPassword, account, email } = req.body;
  if (!currentPassword || !newPassword || !account || !email) {
    return res.status(400).json("invalid request");
  }
  try {
    const data = await db
      .select("email", "hash")
      .from(`${account.toLowerCase()}_users`)
      .where("email", "=", email.toLowerCase());
    const isValid = bcrypt.compareSync(currentPassword, data[0].hash);
    if (isValid) {
      const usertrx = await db.transaction(trx => {
        const hash = bcrypt.hashSync(newPassword);
        return trx
          .where("email", "=", email.toLowerCase())
          .update({ hash: hash })
          .into(`${account.toLowerCase()}_users`);
      });
      return res.status(200).json("updated");
    }
    res.status(400).json("invalid credentials");
  } catch (err) {
    res.status(400).json("error");
  }
};

const handleAddTeam = async (req, res, db) => {
  const { account, user, team, leader } = req.body;
  if (!account || !user || !team || !leader) {
    return res.status(400).json("invalid request");
  }
  try {
    const access = checkUserAccess(account, user);
    if (access !== "owner") {
      return res.status(400).json("invalid access");
    }
    const teamcheck = await db
      .select("*")
      .from(`${account.toLowerCase()}_teams`)
      .where("team", "=", team.toLowerCase());
    if (teamcheck) {
      return res.status(400).json("already exists");
    }
    const teamtrx = await db.transaction(trx => {
      return trx
        .insert({
          team: team,
          leader: leader
        })
        .into(`${account.toLowerCase()}_teams`);
    });
    return res.status(200).json("team added");
  } catch (err) {
    res.status(400).json("error");
  }
};

const handleModifyTeam = async (req, res, db) => {
  const { account, user, leader, team } = req.body;
  if (!account || !user || !leader || !team) {
    return res.status(400).json("invalid request");
  }
  try {
    const access = checkUserAccess(account, user);
    if (access !== "owner") {
      return res.status(400).json("invalid access");
    }
    const teamtrx = await db.transaction(trx => {
      return trx
        .update({ leader: leader })
        .where({ team: team })
        .into(`${account.toLowerCase()}_teams`);
    });
    return res.status(200).json("team updated");
  } catch (err) {
    res.status(400).json("error");
  }
};

const handleAddUser = async (req, res, db, bcrypt) => {
  const { account, user, newuser, team, email, password } = req.body;
  try {
    const access = checkUserAccess(account, user);
    if (access !== "owner") {
      return res.status(400).json("invalid access");
    }
    const userdetails = newuser.match(/\S+/g);
    const userexist = await db
      .select("*")
      .from(`${account.toLowerCase()}_users`)
      .where({ firstname: userdetails[0] })
      .where({ lastname: userdetails[1] });
    if (userexist) {
      return res.status(400).json("already exists");
    }
    const hash = bcrypt.hashSync(newPassword);
    const usertrx = await db.transaction(trx => {
      return trx
        .insert({
          firstname: userdetails[0],
          lastname: userdetails[1],
          team: team,
          email: email,
          hash: hash,
          access: "agent",
          status: "active"
        })
        .into(`${account.toLowerCase()}_users`);
    });
    return res.status(200).json("user added");
  } catch (err) {
    res.status(400).json("error");
  }
};

const handleModifyUser = async (req, res, db) => {
  const { account, user, modifyuser, newteam, status } = req.body;
  if (!account || !user || !modifyuser || !newteam) {
    return res.status(400).json("invalid request");
  }
  try {
    const access = checkUserAccess(account, user);
    if (access !== "owner") {
      return res.status(400).json("invalid access");
    }
    if (status) {
      if (checkUserAccess(account, modifyuser) === "owner") {
        return res.status(400).json("unable to change");
      }
      const userdetails = modifyuser.match(/\S+/g);
      const usertrx = await db.transaction(trx => {
        return trx
          .update({ team: newteam })
          .update({ status: status })
          .where({ firstname: userdetails[0] })
          .where({ lastname: userdetails[1] })
          .into(`${account.toLowerCase()}_users`);
      });
      return res.status(200).json("user updated");
    }
    const userdetails = modifyuser.match(/\S+/g);
    const usertrx = await db.transaction(trx => {
      return trx
        .update({ team: newteam })
        .where({ firstname: userdetails[0] })
        .where({ lastname: userdetails[1] })
        .into(`${account.toLowerCase()}_users`);
    });
    return res.status(200).json("user updated");
  } catch (err) {
    res.status(400).json("error");
  }
};

module.exports = {
  handleUpdateProfile,
  handleAddTeam,
  handleModifyTeam,
  handleAddUser,
  handleModifyUser
};
