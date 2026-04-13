import { Router } from 'express';
import passport from 'passport';
import { clientUrl } from '../configs';
import { logout } from './authController';

const router = Router();

const redirectRoute = {
  failureRedirect: `${clientUrl}/login`,
  successRedirect: `${clientUrl}`,
};

const addSocialRoutes = (socials: string[]) => {
  socials.map((social) => {
    router.get(`/auth/${social}`, passport.authenticate(social));
    router.get(
      `/auth/${social}/callback`,
      passport.authenticate(social, redirectRoute),
    );
  });
};

addSocialRoutes(['google', 'facebook', 'line']);

router.delete('/auth/logout', logout);

export default router;
