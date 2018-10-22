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
    details,
    created_by,
    status,
    date_range
  } = req.body;
  try {
    const results = await db
      .select("*")
      .from(`${account.toLowerCase()}_requests`)
      .where("firstname", "like", firstname ? `${firstname}%` : "%");
    console.log("results", results);
    res.json(`Found ${results}`);
  } catch (err) {
    console.log(err);
    res.status(400).json("search failed");
  }
};

module.exports = {
  handleSearchRequest
};
