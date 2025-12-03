import { Request, Response, NextFunction } from 'express';

export const changeMultiValidate = (req: Request, res: Response, next: NextFunction) => {
    const { ids, action } = req.body;
    const allowedActions = ['active', 'inactive', 'delete'];

    if (!Array.isArray(ids) || ids.length === 0) {
        req.flash('error', 'Danh sách ID không hợp lệ!');
        return res.redirect(req.get('Referrer') || '/');
    }

    if (!allowedActions.includes(action)) {
        req.flash('error', 'Hành động không hợp lệ!');
        return res.redirect(req.get('Referrer') || '/');
    }

    next();
};
