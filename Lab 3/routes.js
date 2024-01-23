const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");

const router = express.Router();
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    (email, password, done) => {
      const user = users.find((user) => user.email === email);

      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "40803774124-1evnlbsfh0qsdmhdvcss4l6n5ibuafij.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
      };

      users.push(user);

      return done(null, user);
    }
  )
);

const users = [];

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);

  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  const user = users.find((user) => user.email === email);
  done(null, user || null);
});

router.get("/", (req, res) => {
  res.render("index", { user: req.user, message: req.flash("success") });
});

router.get("/login", (req, res) => {
  res.render("login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const newUser = {
    email: req.body.email,
    password: hashedPassword,
  };

  users.push(newUser);
  req.flash("success", "Registration successful. You can now log in.");
  res.redirect("/login");
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
