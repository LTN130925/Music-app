import { Request, Response, NextFunction } from 'express';

import prefixNameConfig from '../config/prefixName.config';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Vui lòng đăng nhập');
        return res.redirect(prefixNameConfig.PATH_ADMIN + '/auth/login');
    }
    if (!req.user['roleId']) {
        req.flash('error', 'Vui lòng đăng nhập');
        return res.redirect(prefixNameConfig.PATH_ADMIN + '/auth/login');
    }
    if (req.user['status'] === 'inactive') {
        req.flash('error', 'Tài khoản đã bị khóa!');
        return res.redirect(prefixNameConfig.PATH_ADMIN + '/auth/login');
    }
    if (req.user['deleted']) {
        req.flash('error', 'Tài khoản không tồn tại!');
        return res.redirect(prefixNameConfig.PATH_ADMIN + '/auth/login');
    }
    res.locals.manager = req.user;
    next();
};
