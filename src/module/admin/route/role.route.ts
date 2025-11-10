import {Router} from 'express';

const router = Router();

import {controller} from '../controller/role.controller'
const controllerInstance = new controller();

router.get('/', controllerInstance.index);

router.get('/create', controllerInstance.create);

router.post('/create', controllerInstance.createPost);

router.get('/detail/:id', controllerInstance.detail);

router.patch('/change-status/:id', controllerInstance.changeStatus);

export default router;