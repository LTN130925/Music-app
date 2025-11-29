import {Request, Response} from 'express';

import {notificationsService} from '../service/notification.service';
const serviceInstance = new notificationsService();

export class controller {
    async index(req: Request, res: Response) {
        await serviceInstance.setting(req.params.slug, req.user);
        res.redirect(`/song/detail/${req.params.slug}`);
    }

    async removeAll(req: Request, res: Response) {
        try {
            await serviceInstance.removeAll(req.user);
            req.flash('success', 'Xóa thông báo thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi xóa thông báo, Vui lòng thử lại');
        }
        res.redirect(req.get('Referrer') || '/');
    }
}