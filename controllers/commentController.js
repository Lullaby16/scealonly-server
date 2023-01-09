const pool = require("../db");
const moment = require("moment");

module.exports.addComment = async (req, res) => {
  //checking user log in
  const token = req.session.user;
  const comment = req.body.comment;
  const user_id = req.session.user.user_id;
  const post_id = req.body.post_id;

  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    await pool.query(
      "INSERT INTO comments(comment, created_at, user_id, post_id) values($1,$2,$3,$4)",
      [
        comment,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        user_id,
        post_id,
      ]
    );
    return res.status(200).json("Comment has been created!");
  } else {
    return res.status(422).json("Something went wrong");
  }
};

module.exports.getComment = async (req, res) => {
  //checking user log in
  const token = req.session.user;
  const cursor = req.query.cursor;
  const id = req.query.id;

  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    const comments = await pool.query(
      "SELECT u.username, u.user_id, c.comment_id, c.comment, c.created_at from users u INNER JOIN comments c ON u.user_id = c.user_id WHERE c.post_id = $1 ORDER BY c.comment_id DESC LIMIT 5 OFFSET $2",
      [id, cursor]
    );
    res.send({ cursor: cursor * 1 + 5, posts: comments.rows });
  } else {
    return res.status(422).json("Something went wrong");
  }
};

module.exports.getTotalComment = async (req, res) => {
  //checking user log in
  const token = req.session.user;
  const id = req.query.id;

  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    const comments = await pool.query(
      "SELECT u.user_id, c.comment_id from users u INNER JOIN comments c ON u.user_id = c.user_id WHERE c.post_id = $1",
      [id]
    );
    res.send(comments.rows);
  } else {
    return res.status(422).json("Something went wrong");
  }
};

module.exports.updateComment = async (req, res) => {
  //checking user log in
  const token = req.session.user;
  const comment = req.body.comment;
  const comment_id = req.body.comment_id;
  const user_id = req.session.user.user_id;

  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    await pool.query(
      "UPDATE comments SET comment = $1 WHERE comment_id = $2 AND user_id = $3",
      [comment, comment_id, user_id]
    );
    console.log("berhasil");
    return res.status(200).send("post has been viewed");
  } else {
    return res.status(422).json("Something went wrong");
  }
};

module.exports.deleteComment = async (req, res) => {
  //checking user log in
  const token = req.session.user;
  const comment_id = req.query.cid;
  const user_id = req.query.uid;

  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    await pool.query(
      "DELETE from comments WHERE comment_id = $1 AND user_id = $2",
      [comment_id, user_id]
    );
    return res.status(200).send("comment has been deleted");
  } else {
    return res.status(422).json("Something went wrong");
  }
};
