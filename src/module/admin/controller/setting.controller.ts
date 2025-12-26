import {Request, Response} from 'express';

import {settingService} from "../service/setting.service";
const serviceInstance = new settingService();

export class controller {
    async general(req: Request, res: Response) {
        const data = await serviceInstance.getSettingGeneral();
        res.render('admin/pages/setting/general', {
            titlePage: 'Trang cài đặt chung',
            settings: data || {},
        });
    }

    async generalPost(req: Request, res: Response) {
        await serviceInstance.createSetting(req.body);
        req.flash('success', 'Cập nhật dữ liệu thành công!');
        res.redirect(req.get('Referer') || '/');
    }
}