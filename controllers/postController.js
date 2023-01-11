const pool = require("../db");
const moment = require("moment");

module.exports.getPosts = async (req, res) => {
  //checking user log in
  const token = req.session.user;
  const cursor = req.query.cursor;

  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    const posts = await pool.query(
      "SELECT u.username, p.id, p.user_id, p.title, p.content, p.created_at, p.view from users u INNER JOIN posts p ON u.id = p.user_id ORDER BY p.created_at DESC LIMIT 5 OFFSET $1",
      [cursor]
    );
    res.send({ cursor: cursor * 1 + 5, posts: posts.rows });
  } else {
    return res.status(422).json("Something went wrong");
  }
};

module.exports.getMyPosts = async (req, res) => {
  //checking user log in
  const token = req.session.user;
  const cursor = req.query.cursor;
  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    const posts = await pool.query(
      "SELECT u.username, p.id, p.user_id, p.title, p.content, p.view, p.created_at FROM users u INNER JOIN posts p ON u.id = p.user_id WHERE p.user_id = $1 ORDER BY p.id DESC LIMIT 5 OFFSET $2",
      [req.session.user.user_id, cursor]
    );
    res.send({ cursor: cursor * 1 + 5, posts: posts.rows });
  } else {
    return res.status(422).json("Something went wrong");
  }
};

module.exports.searchPost = async (req, res) => {
  //checking user log in
  const token = req.session.user;
  const id = req.query.id;
  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    const posts = await pool.query(
      "SELECT u.username, p.id, p.user_id, p.title, p.content, p.view, p.created_at FROM users u INNER JOIN posts p ON u.id = p.user_id WHERE p.id = $1",
      [id]
    );
    res.send(posts.rows[0]);
  } else {
    return res.status(422).json("Something went wrong");
  }
};

module.exports.addPost = async (req, res) => {
  //checking user log in
  const token = req.session.user;

  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    await pool.query(
      "INSERT INTO posts(title, content, created_at, user_id) values($1,$2,$3,$4)",
      [
        req.body.title,
        req.body.content,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        req.session.user.user_id,
      ]
    );
    return res.status(200).json("Post has been created!");
  } else {
    return res.status(422).json("Something went wrong");
  }
};

module.exports.viewPosts = async (req, res) => {
  //checking user log in
  const token = req.session.user;
  const sum = req.body.sum;
  const post_id = req.body.post_id;

  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    await pool.query("UPDATE posts SET view = view + $1 WHERE id = $2", [
      sum,
      post_id,
    ]);
    return res.status(200).send("post has been viewed");
  } else {
    return res.status(422).json("Something went wrong");
  }
};

module.exports.updatePosts = async (req, res) => {
  //checking user log in
  const token = req.session.user;
  const content = req.body.content;
  const post_id = req.body.post_id;
  const user_id = req.session.user.user_id;
  //console.log(token);

  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    await pool.query(
      "UPDATE posts SET content = $1 WHERE id = $2 AND user_id = $3",
      [content, post_id, user_id]
    );
    console.log("berhasil");
    return res.status(200).send("post has been viewed");
  } else {
    return res.status(422).json("Something went wrong");
  }
};

module.exports.deletePosts = async (req, res) => {
  //checking user log in
  const token = req.session.user;
  const post_id = req.query.pid;
  const user_id = req.query.uid;

  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    await pool.query("DELETE from posts WHERE id = $1 AND user_id = $2", [
      post_id,
      user_id,
    ]);
    return res.status(200).send("post has been deleted");
  } else {
    return res.status(422).json("Something went wrong");
  }
};
