const handleRequestGet = async (req, res, db) => {
  const { id, account } = req.params;
  try {
    const request = await db
      .select("*")
      .from(`${account.toLowerCase()}_requests`)
      .where({ id });
    const comments = await db
      .select("*")
      .from(`${account.toLowerCase()}_${id}_comments`);
    if (request.length) {
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
        status: request[0].status,
        comments: comments,
        created_by: request[0].created_by,
        created_at: request[0].created_at
      };
      res.json(response);
    } else {
      res.status(400).json("Not found");
    }
  } catch (err) {
    res.status(400).json("error getting request");
  }
};

const handleCommentsAdd = async (req, res, db) => {
  const { id, comments, account, user, team } = req.body;
  try {
    const response = await db.transaction(trx => {
      return trx
        .insert({
          comments: comments,
          team: team,
          created_at: new Date(),
          created_by: user
        })
        .into(`${account}_${id}_comments`);
    });
    res.json("Comment Added");
  } catch (err) {
    console.log(err);
    res.status(400).json("error adding comment");
  }
};

const updateAddComment = async (db, account, id, comments, team, user) => {
  try {
    const response = await db.transaction(trx => {
      return trx
        .insert({
          comments: comments,
          team: team,
          created_at: new Date(),
          created_by: `${user.firstname} ${user.lastname}`
        })
        .into(`${account}_${id}_comments`);
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const handleRequestUpdate = async (req, res, db) => {
  const { id, user, assign_team, assign_person, status, priority } = req.body;
  const { account, team } = user;
  try {
    //Compare the provided data with the current data, adding a comment for any changes.
    const request = await db
      .select("*")
      .from(`${account.toLowerCase()}_requests`)
      .where({ id });
    if (request[0].assign_team != assign_team && assign_team) {
      let comments = `[CHANGED ASSIGNED TEAM] from '${
        request[0].assign_team
      }' to '${assign_team}'.`;
      updateAddComment(db, account, id, comments, team, user);
    }
    if (request[0].assign_person != assign_person && assign_person) {
      let comments = `[CHANGED ASSIGNED PERSON] from '${
        request[0].assign_person
      }' to '${assign_person}'.`;
      updateAddComment(db, account, id, comments, team, user);
      //If assign_person is unassigned, skip this step
      if (assign_person !== "unassigned") {
        const request = await db
          .select("*")
          .from(`${account.toLowerCase()}_requests`)
          .where({ id })
          .orderBy("created_at", "DESC");
        if (!request.length) {
          return res.status(400).json("error updating request");
        }
        const addUserNotification = await db.transaction(trx => {
          return trx
            .insert({
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
              assign_person: assign_person
                ? assign_person
                : request[0].assign_person,
              assign_team: assign_team ? assign_team : request[0].assign_team,
              priority: priority ? priority : request[0].priority,
              details: request[0].details,
              status: status ? status : request[0].status,
              created_by: request[0].created_by,
              created_at: request[0].created_at,
              reference: id,
              alert_time: new Date()
            })
            .into(`${account}_notifications`);
        });
      }
    }
    if (request[0].status != status && status) {
      let comments = `[CHANGED STATUS] from '${
        request[0].status
      }' to '${status}'.`;
      updateAddComment(db, account, id, comments, team, user);
    }
    if (request[0].priority != priority && priority) {
      let comments = `[USER UPDATED] Changed Priority from '${
        request[0].priority
      }' to '${priority}'.`;
      updateAddComment(db, account, id, comments, team, user);
    }
    //Update the database with the new information
    if (!assign_team) {
      const assign_team = request[0].assign_team;
    }
    if (!assign_person) {
      const assign_person = request[0].assign_person;
    }
    if (!priority) {
      const priority = request[0].priority;
    }
    if (!status) {
      const status = request[0].status;
    }
    const response = await db.transaction(trx => {
      return trx
        .from(`${account.toLowerCase()}_requests`)
        .where({ id })
        .update({ assign_team, assign_person, priority, status });
    });
    res.json("Request Updated");
  } catch (err) {
    console.log(err);
    res.status(400).json("error updating request");
  }
};

module.exports = {
  handleRequestGet,
  handleCommentsAdd,
  handleRequestUpdate
};
