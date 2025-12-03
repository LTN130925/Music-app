import { Router } from 'express';
import multer from 'multer';

const upload = multer();
const router = Router();

// upload middleware
import { uploadSingle } from '../../../common/middleware/upload.middleware';

// controller
import { controller } from '../controller/manager.controller';
const controllerInstance = new controller();

// validate
import { idValidate } from '../../../common/validate/id.validate';
import { statusValidate } from '../../../common/validate/status.validate';
import { changeMultiValidate } from '../../../common/validate/changeMulti.validate';
import {dataManagerCreateValidate, dataManagerUpdateValidate} from '../../../common/validate/dataManager.validate';

// -------------------- ROUTES --------------------

router.get('/', controllerInstance.index);

router.get('/detail/:id', idValidate, controllerInstance.detail);

router.get('/create', controllerInstance.create);

router.post(
    '/create',
    dataManagerCreateValidate,
    upload.single('avatar'),
    uploadSingle,
    controllerInstance.createPost
);

router.get('/edit/:id', idValidate, controllerInstance.edit);

router.patch(
    '/edit/:id',
    idValidate,
    dataManagerUpdateValidate,
    upload.single('avatar'),
    uploadSingle,
    controllerInstance.editPatch
);

router.patch('/change-status/:id', idValidate, statusValidate, controllerInstance.changeStatus);

router.delete('/delete/:id', idValidate, controllerInstance.delete);

router.patch('/change-multi', changeMultiValidate, controllerInstance.changeMulti);

export default router;
