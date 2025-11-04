import {Request, Response, NextFunction} from 'express';

import {isValidPassword} from '../../shared/util/isPass.util'

export const updatedLikeSongUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        req.flash('error', 'Đăng nhập tài khoản để tương tác bài hát!');
        return res.redirect(req.get('Referrer') || '/');
    }
    next();
}