import {Request, Response} from 'express';

export class controller {
    contact(req: Request, res: Response) {
        res.render('client/pages/contact/index', {
            titlePage: 'Trang liên hệ'
        });
    }
}