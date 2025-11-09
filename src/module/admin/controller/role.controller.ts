import {Request, Response} from 'express';

import {roleService} from '../service/role.service';
const serviceInstance = new roleService();

export class controller {
    async index(req: Request, res: Response) {
        const data = await serviceInstance.index(req.query);
        res.render('admin/pages/role/list', {
            titlePage: 'Trang nhóm quyền',
            roles: data.roles,
            status: data.status,
            sort: data.sort,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            limit: data.limit,
            keyword: data.keyword,
        });
    }

    create(req: Request, res: Response) {
        res.render('admin/pages/role/create', {
            titlePage: 'Trang tạo mới chức vự',
        });
    }

    async createPost(req: Request, res: Response) {
        try {
            await serviceInstance.create(req.body, req.user);
            req.flash('success', 'Tạo chức quyền thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi tạo vai trò');
        }
        res.redirect(req.get('Referrer') || '/');
    }
}