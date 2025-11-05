import {Router} from 'express';
import multer from 'multer';

const router = Router();

const upload = multer();

// controller
import {controller} from '../controller/singer.controller'
const controllerInstance = new controller();

import {uploadSingle} from '../../../common/middleware/upload.middleware';

router.get('/', controllerInstance.index);

router.get('/create', controllerInstance.create);

router.post('/create', upload.single('avatar'), uploadSingle, controllerInstance.createPost);

router.get('/detail/:id', controllerInstance.detail);

router.get('/edit/:id', controllerInstance.edit);

export default router;