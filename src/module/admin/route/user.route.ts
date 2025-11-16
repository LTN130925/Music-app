import {Router} from 'express';
import multer from 'multer';

const upload = multer();

const router = Router();

import {uploadSingle} from '../../../common/middleware/upload.middleware';

import {controller} from '../controller/user.controller'
const controllerInstance = new controller();

router.get('/', controllerInstance.index);

router.get('/detail/:id', controllerInstance.detail);

router.patch('/change-status/:id', controllerInstance.changeStatus);

router.delete('/delete/:id', controllerInstance.delete);

router.patch('/change-multi', controllerInstance.changeMulti);

export default router;