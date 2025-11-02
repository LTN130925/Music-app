import { Request, Response, NextFunction } from 'express';
import prefixNameConfig from "../config/prefixName.config";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user['roleId']) {
        req.flash('error', 'Vui lòng đăng nhập!')
        return res.redirect('/auth/login');
    }
    res.locals.user = req.user;
    next();
};
