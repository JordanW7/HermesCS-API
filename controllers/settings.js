const checkUserAccess = async (account, user) => {
  try {
    return;
  } catch (err) {
    return "error";
  }
};

const handleUpdateProfile = async (req, res, db) => {
  const { currentPassword, newPassword } = req.body;
  try {
    //Check no missing params
    //Check current password matches,
    //if so change password.
    return;
  } catch (err) {
    res.status(400).json("error");
  }
};

const handleAddTeam = async (req, res, db) => {
  try {
    //Check no missing params
    //CheckUserAccess
    //Check the team doesn't already exist
    //Add new team
    return;
  } catch (err) {
    res.status(400).json("error");
  }
};

const handleModifyTeam = async (req, res, db) => {
  try {
    //Check no missing params
    //CheckUserAccess
    //Make changes
    return;
  } catch (err) {
    res.status(400).json("error");
  }
};

const handleAddUser = async (req, res, db) => {
  try {
    //Check no missing params
    //CheckUserAccess
    //Check the user doesn't already exist
    //Add new user
    return;
  } catch (err) {
    res.status(400).json("error");
  }
};

const handleModifyUser = async (req, res, db) => {
  try {
    //Check no missing params
    //CheckUserAccess
    //Make changes
    return;
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
