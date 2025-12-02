import {Router} from 'express';

const router = Router();

import {controller} from '../controller/feed.controller';
const controllerInstance = new controller();

import {updatedLikeSongUser} from "../../../common/validate/songView.validate";

router.get('/subscribe', updatedLikeSongUser, controllerInstance.index);

router.get('/history', updatedLikeSongUser, controllerInstance.history);

export default router;
