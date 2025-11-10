import {Router} from 'express';

const router = Router();

import {controller} from '../controller/role.controller'
const controllerInstance = new controller();

router.get('/', controllerInstance.index);

router.get('/create', controllerInstance.create);

router.post('/create', controllerInstance.createPost);

router.get('/detail/:id', controllerInstance.detail);

router.get('/edit/:id', controllerInstance.edit);

router.patch('/edit/:id', controllerInstance.editPatch);

router.delete('/delete/:id', controllerInstance.delete);

router.patch('/change-status/:id', controllerInstance.changeStatus);

router.patch('/change-multi', controllerInstance.changeMulti)

export default router;