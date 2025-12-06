import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer();

// controller
import { controller } from '../controller/song.controller';
const controllerInstance = new controller();

// middleware
import { checkPermission } from "../../../common/middleware/checkPermisson.middleware";
import { uploadFields } from '../../../common/middleware/upload.middleware';

// validate
import { idValidate } from '../../../common/validate/id.validate';
import { dataSongValidate } from "../../../common/validate/dataSong.validate";
import { statusValidate } from "../../../common/validate/status.validate";
import { changeMultiValidate } from "../../../common/validate/changeMulti.validate";

// ------------------- ROUTES -------------------

router.get('/',
    checkPermission('song_view'),
    controllerInstance.index
);

router.get('/create',
    checkPermission('song_create'),
    controllerInstance.create
);

router.post(
    '/create',
    checkPermission('song_create'),
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'audio', maxCount: 1 }
    ]),
    dataSongValidate,
    uploadFields,
    controllerInstance.createPost
);

router.get('/edit/:id',
    checkPermission('song_edit'),
    idValidate,
    controllerInstance.edit
);

router.patch(
    '/edit/:id',
    checkPermission('song_edit'),
    idValidate,
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'audio', maxCount: 1 }
    ]),
    dataSongValidate,
    uploadFields,
    controllerInstance.editPatch
);

router.get('/detail/:id',
    checkPermission('song_view'),
    idValidate,
    controllerInstance.detail
);

router.patch(
    '/change-status/:id',
    checkPermission('song_edit'),
    idValidate,
    statusValidate,
    controllerInstance.changeStatus
);

router.delete(
    '/delete/:id',
    checkPermission('song_delete'),
    idValidate,
    controllerInstance.delete
);

router.patch(
    '/change-multi',
    checkPermission('song_edit'),
    changeMultiValidate,
    controllerInstance.changeMulti
);

export default router;
