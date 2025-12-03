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

// permission middleware
import { checkPermission } from "../../../common/middleware/checkPermisson.middleware";

// ---------------- ROUTES ----------------

router.get(
    '/',
    checkPermission('role_view'),
    controllerInstance.index
);

router.get(
    '/create',
    checkPermission('role_create'),
    controllerInstance.create
);

router.post(
    '/create',
    checkPermission('role_create'),
    dataRoleValidate,
    controllerInstance.createPost
);

router.get(
    '/detail/:id',
    checkPermission('role_view'),
    idValidate,
    controllerInstance.detail
);

router.get(
    '/edit/:id',
    checkPermission('role_edit'),
    idValidate,
    controllerInstance.edit
);

router.patch(
    '/edit/:id',
    checkPermission('role_edit'),
    idValidate,
    dataRoleValidate,
    controllerInstance.editPatch
);

router.delete(
    '/delete/:id',
    checkPermission('role_delete'),
    idValidate,
    controllerInstance.delete
);

router.patch(
    '/change-status/:id',
    checkPermission('role_edit'),
    idValidate,
    statusValidate,
    controllerInstance.changeStatus
);

router.patch(
    '/change-multi',
    checkPermission('role_edit'),
    changeMultiValidate,
    controllerInstance.changeMulti
);

export default router;
