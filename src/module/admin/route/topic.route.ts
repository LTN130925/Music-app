import {Router} from 'express';
import multer from 'multer';

const upload = multer();

const router = Router();

// controller
import {controller} from '../controller/topic.controller'
import {uploadSingle} from "../../../common/middleware/upload.middleware";
const controllerInstance = new controller();

router.get('/', controllerInstance.index);

router.get('/detail/:id', controllerInstance.detail);

router.get('/create', controllerInstance.create);

router.post('/create', upload.single('avatar'), uploadSingle, controllerInstance.createPost);

router.get('/edit/:id', controllerInstance.edit);

export default router;