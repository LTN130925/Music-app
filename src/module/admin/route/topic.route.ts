import { Router } from 'express';
import multer from 'multer';

const upload = multer();
const router = Router();

// controller
import { controller } from '../controller/topic.controller';
const controllerInstance = new controller();

// middleware
import { uploadSingle } from "../../../common/middleware/upload.middleware";
import { checkPermission } from "../../../common/middleware/checkPermisson.middleware";

// validate
import { idValidate } from '../../../common/validate/id.validate';
import { statusValidate } from '../../../common/validate/status.validate';
import { changeMultiValidate } from '../../../common/validate/changeMulti.validate';
import { dataTopicValidate } from '../../../common/validate/dataTopic.validate';


// ------------------- ROUTES -------------------

router.get(
    '/',
    checkPermission('topic_view'),
    controllerInstance.index
);

router.get(
    '/detail/:id',
    checkPermission('topic_view'),
    idValidate,
    controllerInstance.detail
);

router.get(
    '/create',
    checkPermission('topic_create'),
    controllerInstance.create
);

router.post(
    '/create',
    checkPermission('topic_create'),
    dataTopicValidate,
    upload.single('avatar'),
    uploadSingle,
    controllerInstance.createPost
);

router.get(
    '/edit/:id',
    checkPermission('topic_edit'),
    idValidate,
    controllerInstance.edit
);

router.patch(
    '/edit/:id',
    checkPermission('topic_edit'),
    idValidate,
    dataTopicValidate,
    upload.single('avatar'),
    uploadSingle,
    controllerInstance.editPatch
);

router.patch(
    '/change-status/:id',
    checkPermission('topic_edit'),
    idValidate,
    statusValidate,
    controllerInstance.changeStatus
);

router.delete(
    '/delete/:id',
    checkPermission('topic_delete'),
    idValidate,
    controllerInstance.delete
);

router.patch(
    '/change-multi',
    checkPermission('topic_edit'),
    changeMultiValidate,
    controllerInstance.changeMulti
);

export default router;
