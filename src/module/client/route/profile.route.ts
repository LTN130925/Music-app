import {Router} from 'express';
import multer from 'multer';

const router = Router();
const upload = multer();

import {uploadSingle} from "../../../common/middleware/upload.middleware";

import {updatedLikeSongUser} from "../../../common/validate/songView.validate";
import {editProfileValidate} from "../../../common/validate/editProfile.validate";
import {changePasswordServerValidate} from "../../../common/validate/changePassword.validate";

import {controller} from '../controller/profile.controller'
const controllerInstance = new controller();

router.get('/', updatedLikeSongUser, controllerInstance.profile);

router.get('/edit', updatedLikeSongUser, controllerInstance.edit);

router.patch(
    '/edit',
    updatedLikeSongUser,
    upload.single('avatar'),
    editProfileValidate,
    uploadSingle,
    controllerInstance.editPatch
);

router.get('/change-password', updatedLikeSongUser, controllerInstance.changePassword);

router.post('/change-password', updatedLikeSongUser, changePasswordServerValidate, controllerInstance.encryptPassword);

router.get('/debug', controllerInstance.debug);

export default router;