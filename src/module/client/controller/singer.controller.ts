import {Request, Response} from 'express';

import {singerService} from '../service/singer.service';
import {IUser} from "../../../common/model/user.model";
const serviceInstance = new singerService();

export class controller {
    async index(req: Request, res: Response) {
        const query = req.query;
        const data = await serviceInstance.index(query);
        res.render('client/pages/singer/list', {
            titlePage: 'Trang ca sĩ',
            singers: data,
            query
        });
    }

    async detail(req: Request, res: Response) {
        try {
            const body = {
                titlePage: 'Trang chi tiết ca sĩ',
                query: req.query
            }
            const data = await serviceInstance.detail(req.query, req.params.id, body);
            if (data) {
                req.flash('error', data);
                return res.redirect(req.get('Referrent') || '/');
            }
            res.render("client/pages/singer/detail", body);
        } catch (e) {
            req.flash('error', 'lỗi dữ liệu');
            res.redirect(req.get('Referrent') || '/');
        }
    }

    async subscribe(req: Request, res: Response) {
        const {type, singerId} = req.params;
        const user = req.user as IUser;
        const data = await serviceInstance.subscribe(type, singerId, user.subscribers);
        res.status(200).json({
            message: 'success',
            data
        });
    }
}