const handleSearchRequest = async (req, res, db) => {
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
    created_by,
    status,
    date_range
  } = req.body;
  try {
    const today = new Date();
    const searchdaterange =
      date_range == "" ? ["2018-01-01T23:59:59.999Z", today] : date_range;
    const results = await db
      .select("*")
      .from(`${account.toLowerCase()}_requests`)
      .where("firstname", "like", firstname ? firstname : "%")
      .where("lastname", "like", lastname ? lastname : "%")
      .where("account", "like", customer_account ? customer_account : "%")
      .where("mobile", "like", mobile ? mobile : "%")
      .where("home", "like", home ? home : "%")
      .where("twitter", "like", twitter ? twitter : "%")
      .where("facebook", "like", facebook ? facebook : "%")
      .where("email", "like", email ? email : "%")
      .where("address", "like", address ? address : "%")
      .where("type", "like", type ? type : "%")
      .where("topic", "like", topic ? topic : "%")
      .where("assign_person", "like", assign_person ? assign_person : "%")
      .where("assign_team", "like", assign_team ? assign_team : "%")
      .where("priority", "like", priority ? priority : "%")
      .where("created_by", "like", created_by ? created_by : "%")
      .where("status", "like", status ? status : "%")
      .where("created_at", ">", searchdaterange[0])
      .where("created_at", "<", searchdaterange[1]);
    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(400).json("search failed");
  }
};

module.exports = {
  handleSearchRequest
};
