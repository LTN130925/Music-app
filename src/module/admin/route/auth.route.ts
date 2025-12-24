import {Router} from 'express';
import passport from 'passport';

const router = Router();

// controller
import {controller} from '../controller/auth.controller';

// config
import prefixNameConfig from '../../../common/config/prefixName.config';

// middleware
import {rateLimitAuthMiddleware} from "../../../common/middleware/rateLimitAuth.middleware";

const controllerInstance = new controller();

router.get('/login', controllerInstance.login);

router.post(
    '/login',
    rateLimitAuthMiddleware,
    passport.authenticate('local-server', {
        successRedirect: prefixNameConfig.PATH_ADMIN + '/dashboard',
        failureRedirect: prefixNameConfig.PATH_ADMIN + '/auth/login',
        failureFlash: true,
    })
);

router.get('/logout', controllerInstance.logout);

export default router;