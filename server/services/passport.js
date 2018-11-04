const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const env = require("../env");
const mongoose = require("mongoose");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new googleStrategy(
    {
      clientID: env.googleClientID,
      clientSecret: env.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }
      
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);
