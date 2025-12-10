import { Router } from 'express';
import multer from 'multer';

const upload = multer();
const router = Router();

// middleware
import { uploadSingle } from '../../../common/middleware/upload.middleware';
import { checkPermission } from "../../../common/middleware/checkPermisson.middleware";

// controller
import { controller } from '../controller/manager.controller';
const controllerInstance = new controller();

// validate
import { idValidate } from '../../../common/validate/id.validate';
import { statusValidate } from '../../../common/validate/status.validate';
import { changeMultiValidate } from '../../../common/validate/changeMulti.validate';
import { dataManagerCreateValidate, dataManagerUpdateValidate } from '../../../common/validate/dataManager.validate';

// -------------------- ROUTES --------------------

router.get(
    '/',
    checkPermission('manager_view'),
    controllerInstance.index
);

router.get('/blog',
    checkPermission('manager_view'),
    controllerInstance.blog
);

router.get(
    '/detail/:id',
    checkPermission('manager_view'),
    idValidate,
    controllerInstance.detail
);

router.get(
    '/create',
    checkPermission('manager_create'),
    controllerInstance.create
);

router.post(
    '/create',
    checkPermission('manager_create'),
    upload.single('avatar'),
    dataManagerCreateValidate,
    uploadSingle,
    controllerInstance.createPost
);

router.get(
    '/edit/:id',
    checkPermission('manager_edit'),
    idValidate,
    controllerInstance.edit
);

router.patch(
    '/edit/:id',
    checkPermission('manager_edit'),
    idValidate,
    upload.single('avatar'),
    dataManagerUpdateValidate,
    uploadSingle,
    controllerInstance.editPatch
);

router.patch(
    '/change-status/:id',
    checkPermission('manager_edit'),
    idValidate,
    statusValidate,
    controllerInstance.changeStatus
);

router.delete(
    '/delete/:id',
    checkPermission('manager_delete'),
    idValidate,
    controllerInstance.delete
);

router.patch(
    '/change-multi',
    checkPermission('manager_edit'),
    changeMultiValidate,
    controllerInstance.changeMulti
);

export default router;
