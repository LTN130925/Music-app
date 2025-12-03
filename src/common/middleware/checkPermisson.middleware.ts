import {Request, Response, NextFunction} from "express";

export const checkPermission = (permission) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userPermissions = req.user['roleId'].permissions.listPermission;

        if (!userPermissions.includes(permission)) {
            req.flash('error', 'Bạn không có quyền truy cập!');
            return res.redirect(req.get('Referrer') || '/');
        }
        next();
    };
};
