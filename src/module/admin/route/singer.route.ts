import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer();

// controller
import { controller } from '../controller/singer.controller';
const controllerInstance = new controller();

// middleware upload
import { uploadSingle } from '../../../common/middleware/upload.middleware';
import { checkPermission } from "../../../common/middleware/checkPermisson.middleware";

// validate
import { idValidate } from '../../../common/validate/id.validate';
import { statusValidate } from '../../../common/validate/status.validate';
import { changeMultiValidate } from '../../../common/validate/changeMulti.validate';
import { dataSingerValidate } from '../../../common/validate/dataSinger.validate';

// ------------------- ROUTES -------------------

router.get(
    '/',
    checkPermission('singer_view'),
    controllerInstance.index
);

router.get('/blog',
    checkPermission('singer_view'),
    controllerInstance.blog
);

router.get(
    '/create',
    checkPermission('singer_create'),
    controllerInstance.create
);

router.post(
    '/create',
    checkPermission('singer_create'),
    upload.single('avatar'),
    dataSingerValidate,
    uploadSingle,
    controllerInstance.createPost
);

router.get(
    '/detail/:id',
    checkPermission('singer_view'),
    idValidate,
    controllerInstance.detail
);

router.get(
    '/edit/:id',
    checkPermission('singer_edit'),
    idValidate,
    controllerInstance.edit
);

router.patch(
    '/edit/:id',
    checkPermission('singer_edit'),
    idValidate,
    upload.single('avatar'),
    dataSingerValidate,
    uploadSingle,
    controllerInstance.editPatch
);

router.patch(
    '/change-status/:id',
    checkPermission('singer_edit'),
    idValidate,
    statusValidate,
    controllerInstance.changeStatus
);

router.delete(
    '/delete/:id',
    checkPermission('singer_delete'),
    idValidate,
    controllerInstance.delete
);

router.patch(
    '/change-multi',
    checkPermission('singer_edit'),
    changeMultiValidate,
    controllerInstance.changeMulti
);

export default router;
