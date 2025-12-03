import { Router } from 'express';

const router = Router();

// controller
import { controller } from '../controller/role.controller';
const controllerInstance = new controller();

// validate
import { idValidate } from '../../../common/validate/id.validate';
import { statusValidate } from '../../../common/validate/status.validate';
import { changeMultiValidate } from '../../../common/validate/changeMulti.validate';
import { dataRoleValidate } from '../../../common/validate/dataRole.validate';

// ---------------- ROUTES ----------------

router.get('/', controllerInstance.index);

router.get('/create', controllerInstance.create);

router.post(
    '/create',
    dataRoleValidate,
    controllerInstance.createPost
);

router.get('/detail/:id', idValidate, controllerInstance.detail);

router.get('/edit/:id', idValidate, controllerInstance.edit);

router.patch(
    '/edit/:id',
    idValidate,
    dataRoleValidate,
    controllerInstance.editPatch
);

router.delete('/delete/:id', idValidate, controllerInstance.delete);

router.patch('/change-status/:id', idValidate, statusValidate, controllerInstance.changeStatus);

router.patch('/change-multi', changeMultiValidate, controllerInstance.changeMulti);

export default router;
