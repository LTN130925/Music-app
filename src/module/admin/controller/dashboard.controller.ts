import {Request, Response} from 'express';

import {dashboardService} from '../service/dashboard.service';
const serviceInstance = new dashboardService();

export class controller {
    async index(req: Request, res: Response) {
        const record = await serviceInstance.index();
        res.render('admin/pages/dashboard/dashboard', {
            titlePage: 'Trang tổng quan',
            ...record
        });
    }
}