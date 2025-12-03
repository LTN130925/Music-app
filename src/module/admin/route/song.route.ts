import {Router} from 'express';
import multer from 'multer';

const router = Router();

const upload = multer();

// controller
import {controller} from '../controller/song.controller'
const controllerInstance = new controller();

// validate
import {idValidate} from '../../../common/validate/id.validate';
import {dataSongValidate} from "../../../common/validate/dataSong.validate";
import {statusValidate} from "../../../common/validate/status.validate";
import {changeMultiValidate} from "../../../common/validate/changeMulti.validate";

// middleware
import {uploadFields} from '../../../common/middleware/upload.middleware'

router.get('/', controllerInstance.index);

router.get('/create', controllerInstance.create);

router.post(
    '/create',
    dataSongValidate,
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'audio', maxCount: 1 }
    ]),
    uploadFields,
    controllerInstance.createPost
);

router.get('/edit/:id', idValidate, controllerInstance.edit);

router.patch(
    '/edit/:id',
    idValidate,
    dataSongValidate,
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'audio', maxCount: 1 }
    ]),
    uploadFields,
    controllerInstance.editPatch
);

router.get('/detail/:id', idValidate, controllerInstance.detail);

router.patch('/change-status/:id', idValidate, statusValidate, controllerInstance.changeStatus);

router.delete('/delete/:id', idValidate, controllerInstance.delete);

router.patch('/change-multi', changeMultiValidate, controllerInstance.changeMulti)

export default router;