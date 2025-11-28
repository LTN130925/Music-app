import { Request, Response, NextFunction } from 'express';

import {countMessages} from '../../shared/helper/cntDocument.helper';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user['roleId']) {
        req.flash('error', 'Vui lòng đăng nhập!')
        return res.redirect('/auth/login');
    }
    res.locals.user = req.user;
    res.locals.totalNotifications = req.user ? await countMessages(req.user) : '';
    next();
};
