const handleNewRequest = async (req, res, db) => {
  const {
    account,
    firstname,
    lastname,
    customer_account,
    mobile,
    home,
    twitter,
    facebook,
    email,
    address,
    type,
    topic,
    assign_person,
    assign_team,
    priority,
    details,
    created_by,
    status
  } = req.body;
  if (
    !account ||
    !type ||
    !topic ||
    !assign_team ||
    !priority ||
    !details ||
    !status ||
    !created_by
  ) {
    return res.status(400).json("incorrect form submission");
  }
  try {
    const request = await db.transaction(trx => {
      return trx
        .returning("id")
        .insert({
          firstname,
          lastname,
          account: customer_account,
          mobile,
          home,
          twitter,
          facebook,
          email,
          address,
          type,
          topic,
          assign_person,
          assign_team,
          priority,
          details,
          status,
          created_by,
          created_at: new Date()
        })
        .into(`${account}_requests`);
    });
    const newID = request[0];
    const addCommentsTable = await db.schema.createTable(
      `${account.toLowerCase()}_${newID}_comments`,
      table => {
        table.increments();
        table.string("created_by");
        table.string("team");
        table.string("comments");
        table.timestamp("created_at");
      }
    );
    if (!assign_person || assign_person === "unassigned") {
      return res.json(request);
    }
    const addUserNotification = await db.transaction(trx => {
      return trx
        .insert({
          firstname,
          lastname,
          account: customer_account,
          mobile,
          home,
          twitter,
          facebook,
          email,
          address,
          type,
          topic,
          assign_person,
          assign_team,
          priority,
          details,
          status,
          created_by,
          created_at: new Date(),
          reference: newID,
          alert_time: new Date()
        })
        .into(`${account}_notifications`);
    });
    res.json(request);
  } catch (err) {
    console.log(err);
    res.status(400).json("unable to add");
  }
};

module.exports = {
  handleNewRequest
};
