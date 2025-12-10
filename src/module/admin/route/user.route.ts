import { Router } from 'express';

const router = Router();

// controller
import { controller } from '../controller/user.controller';
const controllerInstance = new controller();

// validate
import { idValidate } from '../../../common/validate/id.validate';
import { statusValidate } from '../../../common/validate/status.validate';
import { changeMultiValidate } from '../../../common/validate/changeMulti.validate';

// permission middleware
import { checkPermission } from "../../../common/middleware/checkPermisson.middleware";

// ------------------- ROUTES -------------------

router.get(
    '/',
    checkPermission('user_view'),
    controllerInstance.index
);

router.get('/blog',
    checkPermission('user_view'),
    controllerInstance.blog
);

router.get(
    '/detail/:id',
    checkPermission('user_view'),
    idValidate,
    controllerInstance.detail
);

router.patch(
    '/change-status/:id',
    checkPermission('user_edit'),
    idValidate,
    statusValidate,
    controllerInstance.changeStatus
);

router.delete(
    '/delete/:id',
    checkPermission('user_delete'),
    idValidate,
    controllerInstance.delete
);

router.patch(
    '/change-multi',
    checkPermission('user_edit'),
    changeMultiValidate,
    controllerInstance.changeMulti
);

export default router;
