import {Router} from 'express';

const router = Router();

import {controller} from '../controller/profile.controller'
import {updatedLikeSongUser} from "../../../common/validate/songView.validate";

const controllerInstance = new controller();

router.get('/', updatedLikeSongUser, controllerInstance.profile)
router.get('/debug', controllerInstance.debug);

export default router;