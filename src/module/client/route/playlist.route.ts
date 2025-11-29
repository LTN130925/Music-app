import {Router} from 'express';

const router = Router();

import {controller} from '../controller/playlist.controller';
const controllerInstance = new controller();

import {updatedLikeSongUser} from "../../../common/validate/songView.validate";

router.get('/likes', updatedLikeSongUser, controllerInstance.index);

router.get('/favourite', updatedLikeSongUser, controllerInstance.favourite);

export default router;
