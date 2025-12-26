import {Request, Response} from 'express';

import {profileService} from "../service/profile.service";
const serviceInstance = new profileService();

export class controller {
    profile(req: Request, res: Response) {
        res.render('client/pages/profile/profile', {
            titlePage: 'Trang thông tin'
        });
    }

    edit(req: Request, res: Response) {
        res.render('client/pages/profile/edit', {
            titlePage: 'Trang chỉnh sửa thông tin cá nhân',
        })
    }

    async editPatch(req: Request, res: Response) {
        const result = await serviceInstance.editPatch(req.body, req.user['_id']);
        if (!result) {
            req.flash('error', 'Lỗi cập nhật thông tin cá nhân!');
        } else {
            req.flash('success', 'Cập nhật thành công!');
        }
        res.redirect(req.get('Referrer') || '/');
    }

    changePassword(req: Request, res: Response) {
        res.render('client/pages/profile/changePassword', {
            titlePage: 'Trang thay đổi mật khẩu',
        });
    }

    async encryptPassword(req: Request, res: Response) {
        const data = await serviceInstance.cypherPassword(
            req.body['password'],
            req.user['email']
        );
        req.session['text'] = data;
        req.session['path'] = 'change-password';
        res.redirect('/verification/otp');
    }

    debug(req: Request, res: Response) {
        res.json({
            session: req.session,
            data: req.user['messageId'],
        })
    }
}