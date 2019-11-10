const passport = require('passport');
const config = require('config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { findAllUsers } = require('../services/users');
const { getDatabase } = require('./database');

findAllUsers(getDatabase(), (users) => {
  Users = users;
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || config.get('JWT_SECRET'),
};

passport.use(
  'jwt',
  new JwtStrategy(opts, (jwtPayload, done) => {
    try {
      User.findOne({ id: jwtPayload.sub }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    } catch (err) {
      done(err);
    }
  }),
);
