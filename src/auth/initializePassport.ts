import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as LineStrategy } from 'passport-line';

import { googleConfig, facebookConfig, lineConfig } from './authConfig';

import User from '../models/User';
import socialVerify from './socialVerify';

const initializePassport = (passport: passport.PassportStatic): void => {
  if (googleConfig.clientID && googleConfig.clientSecret) {
    passport.use(new GoogleStrategy(googleConfig, socialVerify('google')));
  }
  if (facebookConfig.clientID && facebookConfig.clientSecret) {
    passport.use(new FacebookStrategy(facebookConfig, socialVerify('facebook')));
  }
  if (lineConfig.channelID && lineConfig.channelSecret) {
    passport.use(new LineStrategy(lineConfig, socialVerify('line')));
  }

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    await User.findById(id)
      .then((user) => done(null, user))
      .catch((error) => done(error, null));
  });
};

export default initializePassport;
