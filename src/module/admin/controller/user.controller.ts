import {Request, Response} from 'express';

import {userService} from '../service/user.service';
const serviceInstance = new userService();

export class controller {
    async index(req: Request, res: Response) {
        const data = await serviceInstance.index(req.query, req.user);
        res.render('admin/pages/user/list', {
            titlePage: 'Trang người dùng',
            users: data.users,
            status: data.status,
            sort: data.sort,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            limit: data.limit,
            keyword: data.keyword,
        });
    }

    async blog(req: Request, res: Response) {
        const data = await serviceInstance.blog();
        res.render('admin/pages/blog/index', {
            titlePage: 'Lịch sử chỉnh sửa người dùng',
            history: data,
        });
    }

    async detail(req: Request, res: Response) {
        const data = await serviceInstance.detail(req.params.id);
        res.render('admin/pages/user/detail', {
            titlePage: 'Trang chi tiết tài khoản',
            user: data,
        });
    }

    async changeStatus(req: Request, res: Response) {
        await serviceInstance.changeStatus(req.params.id, req.body, req.user);
        res.json({ status: 'active' });
    }

    async delete(req: Request, res: Response) {
        try {
            await serviceInstance.delete(req.params.id, req.user);
            req.flash('success', 'Xóa tài khoản quản trị thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi xóa tài khoản!');
        }
        res.redirect(req.get('Referrer') || '/');
    }

    async changeMulti(req: Request, res: Response) {
        try {
            const { ids, action } = req.body;
            const result = await serviceInstance.changeMulti(JSON.parse(ids), action, req.user);
            if (result.result) {
                req.flash('error', result.data.text);
                return res.redirect(req.get('Referrer') || '/');
            }
            req.flash('success', `Cập nhật ${result.data.value} tài khoản thành công!`);
        } catch (e) {
            req.flash('error', 'Lỗi cập nhật tài khoản!');
        }
        res.redirect(req.get('Referrer') || '/');
    }
}