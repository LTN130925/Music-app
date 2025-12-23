import {Router} from 'express';

const router = Router();

// controller
import {controller} from '../controller/apiComment.controller'
const controllerInstance = new controller();

import {idValidate} from "../../../common/validate/id.validate";

router.get('/song/:id/comments', idValidate, controllerInstance.getListComments);

router.post('/song/:id/comments', idValidate, controllerInstance.commentPost);

export default router;