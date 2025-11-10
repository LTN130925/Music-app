import {Router} from 'express';

const router = Router();

// controller
import {controller} from '../controller/topic.controller'
const controllerInstance = new controller();

router.get('/', controllerInstance.index);

router.get('/detail/:id', controllerInstance.detail);

router.get('/create', controllerInstance.create);

export default router;