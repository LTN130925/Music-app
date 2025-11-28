import {Request, Response} from 'express';

export class controller {
    profile(req: Request, res: Response) {
        res.render('client/pages/profile/profile', {
            titlePage: 'Trang thông tin'
        });
    }

    debug(req: Request, res: Response) {
        res.json({
            session: req.session,
            data: req.user['messageId'],
        })
    }
}