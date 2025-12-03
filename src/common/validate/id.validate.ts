import {Request, Response, NextFunction} from 'express';

export const idValidate = (req: Request, res: Response, next: NextFunction) => {
    if (req.params.id) {
        req.flash('error', 'Không tồn tại id!');
        return res.redirect(req.get('Referrer') || '/');
    }
    next();
}