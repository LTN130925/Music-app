import {Request, Response, NextFunction} from 'express';

import {isValidPassword} from '../../shared/util/isPass.util';

export const changePasswordForgotValidate = (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.email) {
        req.flash('error', 'Email rỗng!');
        return res.redirect(req.get('referrent') || '/');
    }
    if (!req.body.password) {
        req.flash('error', 'Mật khẩu rỗng!');
        return res.redirect(req.get('referrent') || '/');
    }
    if (!isValidPassword(req.body.password)) {
        req.flash('error', 'Mật khẩu không hợp lệ!');
        return res.redirect(req.get('referrent') || '/');
    }
    if (req.body.password !== req.body['confirm-password']) {
        req.flash('error', 'Mật khẩu xác thực không khớp!');
        return res.redirect(req.get('referrent') || '/');
    }
    next();
}

