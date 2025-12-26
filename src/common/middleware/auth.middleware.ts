import { Request, Response, NextFunction } from 'express';

import {countMessages} from '../../shared/helper/cntDocument.helper';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user['status'] === 'inactive') {
        req.flash('error', 'tài khoản của bạn đã bị khóa!');
        return res.redirect('/auth/login');
    }
    if (req.user && req.user['deleted']) {
        req.flash('error', 'tài khoản của không tồn tại!');
        return res.redirect('/auth/login');
    }
    res.locals.user = req.user;
    res.locals.totalNotifications = req.user ? await countMessages(req.user) : '';
    next();
};
