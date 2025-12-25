import {Router} from 'express';
import multer from 'multer';

const router = Router();
const upload = multer();

import {controller} from '../controller/profile.controller'
const controllerInstance = new controller();

// validate
import {editProfileValidate} from "../../../common/validate/editProfile.validate";

// middleware
import {uploadSingle} from "../../../common/middleware/upload.middleware";
import {changePasswordServerValidate} from "../../../common/validate/changePassword.validate";

router.get('/', controllerInstance.profile);

router.get('/edit', controllerInstance.edit);

router.patch(
    '/edit',
    upload.single('avatar'),
    editProfileValidate,
    uploadSingle,
    controllerInstance.editPatch
);

router.get('/change-password', controllerInstance.changePassword);

router.post('/change-password', changePasswordServerValidate, controllerInstance.encryptPassword);

router.get('/verification/otp', controllerInstance.otp);

router.patch('/verification/otp', controllerInstance.verificationOtp)

router.get('/debug', controllerInstance.debug)

export default router;