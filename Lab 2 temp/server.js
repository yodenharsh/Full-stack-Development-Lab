const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport");

const app = express();

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(
  cookieSession({
    name: "google-auth-session",
    keys: ["key1", "key2"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 5000;

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.get("/", (req, res) => {
  res.render("loginwithgoogle.ejs");
});

app.get("/failed", (req, res) => {
  res.send("Failed");
});
app.get("/success", (req, res, next) => {
  isLoggedIn(req, res, next);
  res.send(`Welcome ${req.user.email}`);
});

app.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  (req, res) => {
    res.redirect("/success");
  }
);

app.use(function (err, req, res, next) {
  res.write("Congrats, you are logged in");
  console.log(err);
  res.end();
});

app.listen(port, () => console.log("server running on port " + port));
