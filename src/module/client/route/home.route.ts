import {Router} from 'express';

const router = Router();

import {controller} from '../controller/home.controller';
const controllerInstance = new controller();

router.get('/', controllerInstance.home);

export default router;
