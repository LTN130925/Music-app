import {Router} from 'express';
import passport from 'passport';

const router = Router();

// controller
import {controller} from '../controller/auth.controller';

// validate
import {registerValidate} from '../../../common/validate/auth.validate'
import {checkAccessPathTimeValidate} from "../../../common/validate/checkAccessPathTime.validate";
import {changePasswordForgotValidate} from "../../../common/validate/changePassword.validate";

const controllerInstance = new controller();

router.get('/register', controllerInstance.register);

router.post('/register', registerValidate, controllerInstance.registerPost);

router.get('/login', controllerInstance.login);

router.post(
    '/login',
    passport.authenticate('local-client', {
        successRedirect: '/home',
        failureRedirect: '/auth/login',
        failureFlash: true,
    })
)

router.get('/forgot', controllerInstance.forgot);

router.post('/forgot', controllerInstance.forgotPost);

router.get('/forgot/otp', controllerInstance.forgotOtp);

router.post('/forgot/otp', controllerInstance.forgotOtpPost);

router.get('/change-password', checkAccessPathTimeValidate, controllerInstance.changePassword);

router.post('/change-password', changePasswordForgotValidate, controllerInstance.changePasswordReset);

router.get('/debug', controllerInstance.debug);

router.get('/logout', controllerInstance.logout);

export default router;