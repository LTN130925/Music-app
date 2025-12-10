import {Request, Response} from 'express';

import {homeService} from "../service/home.service";
const serviceInstance = new homeService();

export class controller {
    async home(req: Request, res: Response) {
        const data = await serviceInstance.home();
        res.render("client/pages/home/index", {
            titlePage: 'Trang chủ',
            ...data,
        });
    }
}