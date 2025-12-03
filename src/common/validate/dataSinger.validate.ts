import { Request, Response, NextFunction } from 'express';

export const dataSingerValidate = (req: Request, res: Response, next: NextFunction) => {
    const { fullName } = req.body;

    if (!fullName || fullName.trim() === "") {
        req.flash('error', 'Tên ca sĩ không được để trống!');
        return res.redirect(req.get('Referrer') || '/');
    }

    next();
};
