import { Request, Response, NextFunction } from 'express';

export const dataTopicValidate = (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        req.flash('error', 'Tên chủ đề không được để trống!');
        return res.redirect(req.get('Referrer') || '/');
    }

    next();
};
