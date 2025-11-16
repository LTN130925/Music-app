import {Request, Response} from 'express';

import {singerService} from '../service/singer.service';
const serviceInstance = new singerService();

export class controller {
    async index(req: Request, res: Response) {
        const query = req.query;
        const data = await serviceInstance.index(query);
        res.render('client/pages/singer/list', {
            singers: data,
            query
        });
    }

}