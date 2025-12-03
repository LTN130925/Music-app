import { Router } from 'express';

const router = Router();

// controller
import { controller } from '../controller/user.controller';
const controllerInstance = new controller();

// validate
import { idValidate } from '../../../common/validate/id.validate';
import { statusValidate } from '../../../common/validate/status.validate';
import { changeMultiValidate } from '../../../common/validate/changeMulti.validate';

// ------------------- ROUTES -------------------

router.get('/', controllerInstance.index);

router.get('/detail/:id', idValidate, controllerInstance.detail);

router.patch('/change-status/:id', idValidate, statusValidate, controllerInstance.changeStatus);

router.delete('/delete/:id', idValidate, controllerInstance.delete);

router.patch('/change-multi', changeMultiValidate, controllerInstance.changeMulti);

export default router;
