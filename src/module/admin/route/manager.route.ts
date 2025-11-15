import {Router} from 'express';
import multer from 'multer';

const upload = multer();

const router = Router();

import {uploadSingle} from '../../../common/middleware/upload.middleware';

import {controller} from '../controller/manager.controller'
const controllerInstance = new controller();

router.get('/', controllerInstance.index);

router.get('/detail/:id', controllerInstance.detail);

router.get('/create', controllerInstance.create);

router.post('/create', upload.single('avatar'), uploadSingle, controllerInstance.createPost);

router.get('/edit/:id', controllerInstance.edit);

router.patch('/edit/:id', upload.single('avatar'), uploadSingle, controllerInstance.editPatch);

router.patch('/change-status/:id', controllerInstance.changeStatus);

router.delete('/delete/:id', controllerInstance.delete);

router.patch('/change-multi', controllerInstance.changeMulti);

export default router;