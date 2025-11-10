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

    async detail(req: Request, res: Response) {
        const data = await serviceInstance.detail(req.params.id);
        res.render('admin/pages/role/detail.pug', {
            titlePage: 'Trang chi tiết chức vụ',
            role: data,
        });
    }

    async edit(req: Request, res: Response) {
        const data = await serviceInstance.edit(req.params.id);
        res.render('admin/pages/role/edit.pug', {
            titlePage: 'Trang chỉnh sửa chức vụ',
            role: data,
        });
    }

    async editPatch(req: Request, res: Response) {
        try {
            await serviceInstance.editPatch(req.params.id, req.body, req.user);
            req.flash('success', 'Cập nhật chức vụ thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi cập nhật chức vụ!');
        }
        res.redirect(req.get('Referrer') || '/');
    }

    async createPost(req: Request, res: Response) {
        try {
            await serviceInstance.createPost(req.body, req.user);
            req.flash('success', 'Tạo chức quyền thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi tạo vai trò');
        }
        res.redirect(req.get('Referrer') || '/');
    }

    async delete(req: Request, res: Response) {
        try {
            await serviceInstance.delete(req.params.id, req.user);
            req.flash('success', 'Xóa chức quyền thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi xóa chức quyền!');
        }
        res.redirect(req.get('Referrer') || '/');
    }

    async changeStatus(req: Request, res: Response) {
        await serviceInstance.changeStatus(req.params.id, req.body, req.user);
        res.json({status: 'active'});
    }

    async changeMulti(req: Request, res: Response) {
        try {
            const {ids, action} = req.body;
            const result = await serviceInstance.changeMulti(JSON.parse(ids), action, req.user);
            if (result.result) {
                req.flash('error', result.data.text);
                return res.redirect(req.get('Referrer') || '/');
            }
            req.flash('success', `Cập nhật ${result.data.value} chức vụ thành công!`);
        } catch (e) {
            req.flash('error', 'Lỗi cập nhật chức vụ');
        }
        res.redirect(req.get('Referrer') || '/');
    }
}