import {NextFunction, Request, Response} from "express";

import {ForgotPassword} from "../model/forgot.model";

export const checkAccessPathTimeValidate = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.session['text'];
    const findTarget = await ForgotPassword.findOne({email});
    if (!findTarget) {
        req.flash('error', 'Bạn không thể truy cập vào đường dẫn này!');
        return res.redirect(req.get('referrent') || '/');
    }
    next();
}