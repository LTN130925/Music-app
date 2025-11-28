import {Router} from 'express';

const router = Router();

import {controller} from '../controller/notification.controller';
const controllerInstance = new controller();

router.get('/:slug', controllerInstance.index);

export default router;
