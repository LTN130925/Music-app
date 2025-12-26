import {Router} from 'express';
import multer from "multer";

const router = Router();
const upload = multer();

import {uploadSingle} from "../../../common/middleware/upload.middleware";
import {checkPermission} from "../../../common/middleware/checkPermisson.middleware";

import {controller} from '../controller/setting.controller'
const controllerInstance = new controller();

router.get('/general', checkPermission('manager_edit'), controllerInstance.general);

router.post(
    '/general',
    checkPermission('manager_view'),
    upload.single('logo'),
    uploadSingle,
    controllerInstance.generalPost
);

export default router;