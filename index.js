const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const commentRouter = require("./routers/commentRouter");
const profileRouter = require("./routers/profileRouter");
const session = require("express-session");
require("dotenv").config();

const app = express();

const server = require("http").createServer(app);

app.use(helmet());
app.use(
  cors({
    origin: process.env.FE_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENVIRONMENT === "production" ? "true" : "auto",
      httpOnly: true,
      expires: 1000 * 60 * 60 * 24 * 7,
      sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
    },
  })
);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/profile", profileRouter);

server.listen(process.env.PORT, () => {
  console.log("Server listening on port 4000");
});
