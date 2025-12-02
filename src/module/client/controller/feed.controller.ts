import {Request, Response} from 'express';

import {feedService} from '../service/feed.service';
const serviceInstance = new feedService();

export class controller {
    async index(req: Request, res: Response) {
        const query = req.query;
        const subscribers = await serviceInstance.getSubscribers(req.user, req.query);
        res.render('client/pages/singer/list', {
            titlePage: 'Danh sách các ca sĩ đăng kí',
            singers: subscribers,
            query
        });
    }

    async history(req: Request, res: Response) {
        const songs = await serviceInstance.getHistory(req.user);
        res.render('client/pages/songs/list', {
            titlePage: 'Danh sách các bài hát đã xem gần đây',
            songs,
        });
    }
}