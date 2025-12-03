import { Router } from 'express';
import multer from 'multer';

const upload = multer();
const router = Router();

// controller
import { controller } from '../controller/topic.controller';
import { uploadSingle } from "../../../common/middleware/upload.middleware";
const controllerInstance = new controller();

// validate
import { idValidate } from '../../../common/validate/id.validate';
import { statusValidate } from '../../../common/validate/status.validate';
import { changeMultiValidate } from '../../../common/validate/changeMulti.validate';
import { dataTopicValidate } from '../../../common/validate/dataTopic.validate';

// ------------------- ROUTES -------------------

router.get('/', controllerInstance.index);

router.get('/detail/:id', idValidate, controllerInstance.detail);

router.get('/create', controllerInstance.create);

router.post(
    '/create',
    dataTopicValidate,
    upload.single('avatar'),
    uploadSingle,
    controllerInstance.createPost
);

router.get('/edit/:id', idValidate, controllerInstance.edit);

router.patch(
    '/edit/:id',
    idValidate,
    dataTopicValidate,
    upload.single('avatar'),
    uploadSingle,
    controllerInstance.editPatch
);

router.patch('/change-status/:id', idValidate, statusValidate, controllerInstance.changeStatus);

router.delete('/delete/:id', idValidate, controllerInstance.delete);

router.patch('/change-multi', changeMultiValidate, controllerInstance.changeMulti);

export default router;
