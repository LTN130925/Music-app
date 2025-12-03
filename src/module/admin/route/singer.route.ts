import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer();

// controller
import { controller } from '../controller/singer.controller';
const controllerInstance = new controller();

// middleware upload
import { uploadSingle } from '../../../common/middleware/upload.middleware';

// validate
import { idValidate } from '../../../common/validate/id.validate';
import { statusValidate } from '../../../common/validate/status.validate';
import { changeMultiValidate } from '../../../common/validate/changeMulti.validate';
import { dataSingerValidate } from '../../../common/validate/dataSinger.validate';

// ------------------- ROUTES -------------------

router.get('/', controllerInstance.index);

router.get('/create', controllerInstance.create);

router.post(
    '/create',
    dataSingerValidate,
    upload.single('avatar'),
    uploadSingle,
    controllerInstance.createPost
);

router.get('/detail/:id', idValidate, controllerInstance.detail);

router.get('/edit/:id', idValidate, controllerInstance.edit);

router.patch(
    '/edit/:id',
    idValidate,
    dataSingerValidate,
    upload.single('avatar'),
    uploadSingle,
    controllerInstance.editPatch
);

router.patch('/change-status/:id', idValidate, statusValidate, controllerInstance.changeStatus);

router.delete('/delete/:id', idValidate, controllerInstance.delete);

router.patch('/change-multi', changeMultiValidate, controllerInstance.changeMulti);

export default router;
