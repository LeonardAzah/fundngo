const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../model/User");
const createTokenUser = require("../util/createTokenUser");
const logger = require("../util/logger");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://fundngo.onrender.com/api/v1/google/callback",
        passReqToCallback: true,
      },
      async function (request, accessToken, refreshToken, profile, done) {
        try {
          // Check if the user already exists in the database
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = new User({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
              isValidated: true,
              isVerified: true,
              verified: new Date(),
            });
            await user.save();
          }
          logger.info("Logged in from google");
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    const tokenUser = createTokenUser(user);

    done(null, tokenUser);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
