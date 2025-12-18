import { Router } from 'express';

// controller
import { controller } from '../controller/dashboard.controller';
const controllerInstance = new controller();

const router = Router();
// ------------------- ROUTES -------------------

router.get('/', controllerInstance.index);

export default router;
