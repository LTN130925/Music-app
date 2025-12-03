import { Request, Response, NextFunction } from 'express';

const data = ['admin-server', 'admin-user', 'admin-singer', 'admin-manager', 'admin-role'];

export const dataRoleValidate = (req: Request, res: Response, next: NextFunction) => {
    const { title, role, description } = req.body;
    if (!title || !role || !description) {
        req.flash('error', 'Có dữ liệu đầu vào không tồn tại!');
        return res.redirect(req.get('Referrer') || '/');
    }
    if (!role.includes(data)) {
        req.flash('error', 'Dữ liệu quyền bị can thiệp!');
        return res.redirect(req.get('Referrer') || '/');
    }
    
    next();
};
