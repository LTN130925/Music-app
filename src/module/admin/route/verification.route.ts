import {Router} from 'express';

const router = Router();

import {controller} from '../controller/verification.controller'
const controllerInstance = new controller();

router.get('/otp', controllerInstance.otp);

router.patch('/otp/change-password', controllerInstance.verificationOtpChangePassword);

router.patch('/otp/create-manager', controllerInstance.verificationOtpCreateManager);

router.patch('/otp/edit-manager', controllerInstance.verificationOtpEditManager);

export default router;