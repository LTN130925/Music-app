import {Router} from 'express';

const router = Router();

import {controller} from '../controller/playlist.controller';
const controllerInstance = new controller();

router.get('/likes', controllerInstance.index);

export default router;
