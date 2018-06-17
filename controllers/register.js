const handleRegister = (req, res, db, bcrypt) => {
  const { account, firstname, lastname, email, password } = req.body;
  if (!account || !firstname || !lastname || !email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  knex.schema.createTable(`${account}_users`,(table) => {
    table.increments();
    table.string('firstname');
    table.string('lastname');
    table.string('email');
    table.string('hash');
    table.string('access');
    table.string('team');
  }
  knex.schema.createTable(`${account}_requests`,(table) => {
    table.increments();
    table.string('firstname');
    table.string('lastname');
    table.string('account');
    table.string('mobile');
    table.string('home');
    table.string('twitter');
    table.string('facebook');
    table.string('email');
    table.string('address');
    table.string('type');
    table.string('topic');
    table.string('assign_person');
    table.string('assign_team');
    table.string('priority');
    table.string('details');
    table.string('attachments');
    table.string('status');
    table.string('comments');
    table.string('user');
    table.timestamps();
  }

  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        firstname: firstname,
        lastname: lastname,
        email: email,
        hash: hash,
        access: "admin",
        team: "Customer Services",
      })
      .into(`${account}-users`)
      .returning('email')
      .then(loginEmail => {
        return trx('databaselist')
          .returning('*')
          .insert({
            name: account,
            owner: loginEmail[0],
            created_at: new Date()
          })
          .then(account => {
            res.json(account[0]);
          })
      })
      .then(account => {
            res.json(account[0]);
          })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
  handleRegister: handleRegister
};