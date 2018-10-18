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
    created_by
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
    //Need to add request to the ${account}_requests database
    const request = await db.transaction(trx => {
      return trx
        .insert({
          firstname,
          lastname,
          useraccount,
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
    console.log(request);
    //Grab the ID of the new request
    //Need to create a ${account}_${id}_comments database
    // const addCommentsTable = await db.schema.createTable(
    //   `${account.toLowerCase()}_requests`,
    //   table => {
    //     table.increments();
    //     table.string("firstname");
  } catch (err) {
    console.log(err);
    res.status(400).json("unable to add");
  }
};

module.exports = {
  handleNewRequest
};
