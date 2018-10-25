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

const handleNotificationsDel = async (req, res, db) => {
  const { id, assign_person, account } = req.params;
  try {
    const notifications = await db
      .from(`${account.toLowerCase()}_notifications`)
      .where({ assign_person })
      .where({ reference: id })
      .del();
    res.json("removed");
  } catch (err) {
    res.status(400).json("error getting notifications");
  }
};

module.exports = {
  handleNotificationsGet,
  handleNotificationsDel
};
