const handleRequestGet = async (req, res, db) => {
  const { id, account } = req.params;
  try {
    const request = await db
      .select("*")
      .from(`${account.toLowerCase()}_requests`)
      .where({ id });
    if (request.length) {
      console.log("REQUEST INFO", request);
      const response = {
        id: request[0].id,
        firstname: request[0].firstname,
        lastname: request[0].lastname,
        mobile: request[0].mobile,
        home: request[0].home,
        twitter: request[0].twitter,
        facebook: request[0].facebook,
        email: request[0].email,
        address: request[0].address,
        type: request[0].type,
        topic: request[0].topic,
        assign_person: request[0].assign_person,
        assign_team: request[0].assign_team,
        priority: request[0].priority,
        details: request[0].details,
        attachments: request[0].attachments,
        status: request[0].status,
        comments: request[0].comments,
        created_by: request[0].created_by,
        created_at: request[0].created_at,
        updated_at: request[0].updated_at
      };
      res.json(response);
    } else {
      res.status(400).json("Not found");
    }
  } catch (err) {
    res.status(400).json("error getting request");
  }
};

module.exports = {
  handleRequestGet
};
