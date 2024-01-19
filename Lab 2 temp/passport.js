const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "40803774124-1evnlbsfh0qsdmhdvcss4l6n5ibuafij.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
