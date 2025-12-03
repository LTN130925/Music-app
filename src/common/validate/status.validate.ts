import { Request, Response, NextFunction } from 'express';

export const statusValidate = (req: Request, res: Response, next: NextFunction) => {
    const allowed = ['active', 'inactive'];
    if (!allowed.includes(req.body.status)) {
        req.flash('error', 'Trạng thái không đúng!');
        return res.redirect(req.get('Referrer') || '/');
    }
    next();
};
