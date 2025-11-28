import {Request, Response} from 'express';

import {notificationsService} from '../service/notification.service';
const serviceInstance = new notificationsService();

export class controller {
    async index(req: Request, res: Response) {
        await serviceInstance.setting(req.params.slug, req.user);
        res.redirect(`/song/detail/${req.params.slug}`);
    }
}