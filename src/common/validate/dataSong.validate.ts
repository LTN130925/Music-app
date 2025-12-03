import { Request, Response, NextFunction } from 'express';

export const dataSongValidate = (req: Request, res: Response, next: NextFunction) => {
    const { title, topicId, singerId } = req.body;
    if (!title || !topicId || !singerId) {
        req.flash('error', 'Dữ liệu nhập không đúng!');
        return res.redirect(req.get('Referrer') || '/');
    }
    next();
};
