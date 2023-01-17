const pool = require("../db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports.handleLogin = (req, res) => {
  if (req.session.user && req.session.user.username) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    return res.json({ loggedIn: false });
  }
};

module.exports.attemptLogin = async (req, res) => {
  //checking user
  const potentialLogin = await pool.query(
    "SELECT id, username, passhash, verified FROM users WHERE username=$1",
    [req.body.username]
  );

  if (potentialLogin.rowCount > 0) {
    if (potentialLogin.rows[0].verified === false) {
      //verified email
      return res.json({
        loggedIn: false,
        status: "Please verified your email first",
      });
    } else {
      const isSamePass = await bcrypt.compare(
        req.body.password,
        potentialLogin.rows[0].passhash
      );
      if (isSamePass) {
        //login
        req.session.user = {
          username: req.body.username,
          user_id: potentialLogin.rows[0].id,
        };
        res.json({ loggedIn: true, username: req.body.username });
      } else {
        //error
        return res.json({
          loggedIn: false,
          status: "Wrong username or password!",
        });
      }
    }
  } else {
    return res.json({ loggedIn: false, status: "Wrong username or password!" });
  }
};

module.exports.attemptRegister = async (req, res) => {
  //checking data
  const existingUser = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );

  if (existingUser.rowCount === 0) {
    //register
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO users(email, username, passhash) values($1,$2,$3) RETURNING id, username",
      [req.body.email, req.body.username, hashedPass]
    );
    req.session.user = {
      username: req.body.username,
      user_id: newUserQuery.rows[0].id,
    };

    try {
      //const uniqueString = uuidv4();
      const token = req.session.user.user_id;
      const url = `http://localhost:4000/auth/verify/${token}`;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.AUTH_EMAIL,
          pass: process.env.AUTH_PASS,
        },
      });

      transporter.sendMail({
        to: req.body.email,
        subject: "Verify your email",
        html: `<p>Verify your email address to complete the signup and login into your account.</p><p>This link <b>expires in 6 hours</b>.</p><p>Press <a href=${url}>here</a> to proceed.</p>`,
      });
    } catch (error) {
      return res.json({ error: error, status: "Something is wrong" });
    }

    res.json({
      loggedIn: false,
      status: "Please check your email to verify and login to your account",
    });
  } else {
    //error
    return res.json({ loggedIn: false, status: "Account already exist" });
  }
};

module.exports.verifyEmail = async (req, res) => {
  const id = req.params.token;
  //const id = param.slice(0, 2);

  try {
    await pool.query("UPDATE users set verified = true WHERE id = $1", [id]);

    res.redirect(`http://localhost:3000/login`);
  } catch (error) {
    res.json({ error: error, status: "Your account has been verified" });
  }
};

module.exports.handleLogout = async (req, res) => {
  //checking user log in
  const token = req.session.user;

  if (!token)
    return res.status(401).json({ loggedIn: false, status: "Not logged in!" });

  if (token) {
    req.session.destroy();
    res.send({ loggedIn: false, status: "User log out" });
  } else {
    return res.status(422).json("Something went wrong");
  }
};
