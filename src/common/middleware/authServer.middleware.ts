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
    res.locals.manager = req.user;
    next();
};
