import {Request, Response, NextFunction} from 'express';

export const editProfileValidate = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.fullName) {
        req.flash('error', 'Họ và tên rỗng!');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!req.body.email) {
        req.flash('error', 'Email rỗng!');
        return res.redirect(req.get('Referrer') || '/');
    }
    next();
}

