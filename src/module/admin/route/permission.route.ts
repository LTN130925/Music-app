import {Router} from 'express';

const router = Router();

import {controller} from '../controller/permission.controller'
const controllerInstance = new controller();

router.get('/', controllerInstance.index)

router.patch('/update', controllerInstance.update);

router.get('/debug', controllerInstance.debug);

export default router;