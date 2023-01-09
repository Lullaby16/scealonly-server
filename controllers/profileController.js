const pool = require("../db");

module.exports.getProfile = async (req, res) => {
  //checking user log in
  const token = req.session.user;
  const user_id = req.session.user.user_id;

  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    const profile = await pool.query(
      "SELECT user_id, username, created_at from users WHERE user_id = $1",
      [user_id]
    );
    res.json(profile.rows[0]);
  } else {
    return res.status(422).json("Something went wrong");
  }
};
