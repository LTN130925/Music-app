import {Router} from 'express';

const router = Router();

// controller
import {controller} from '../controller/contact.controller';
const controllerInstance = new controller();

router.get('/', controllerInstance.contact);

export default router;