const handleNotificationsGet = async (req, res, db) => {
  const { assign_person, account } = req.params;
  try {
    const notifications = await db
      .select("*")
      .from(`${account.toLowerCase()}_notifications`)
      .where({ assign_person });
    res.json(notifications);
  } catch (err) {
    res.status(400).json("error getting notifications");
  }
};

const handleNotificationsTeamGet = async (req, res, db) => {
  const { assign_team, account } = req.params;
  try {
    const extreme = await db
      .select("*")
      .from(`${account.toLowerCase()}_requests`)
      .where({ assign_team })
      .where({ priority: "extreme" });
    const high = await db
      .select("*")
      .from(`${account.toLowerCase()}_requests`)
      .where({ assign_team })
      .where({ priority: "high" });
    const medium = await db
      .select("*")
      .from(`${account.toLowerCase()}_requests`)
      .where({ assign_team })
      .where({ priority: "medium" });
    const low = await db
      .select("*")
      .from(`${account.toLowerCase()}_requests`)
      .where({ assign_team })
      .where({ priority: "low" });
    const response = {
      extreme: extreme.length,
      high: high.length,
      medium: medium.length,
      low: low.length,
      total: extreme.length + high.length + medium.length + low.length
    };
    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(400).json("error getting notifications");
  }
};

const handleNotificationsDel = async (req, res, db) => {
  const { id, assign_person, account } = req.body;
  try {
    const notifications = await db
      .from(`${account.toLowerCase()}_notifications`)
      .where({ assign_person })
      .where({ reference: id })
      .del();
    res.json("removed");
  } catch (err) {
    res.status(400).json("error deleting notifications");
  }
};

module.exports = {
  handleNotificationsGet,
  handleNotificationsDel,
  handleNotificationsTeamGet
};
