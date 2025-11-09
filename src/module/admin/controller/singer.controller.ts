import {Request, Response} from 'express';

import {singerService} from '../service/singer.service';
const serviceInstance = new singerService();

export class controller {
    async index(req: Request, res: Response) {
        const data = await serviceInstance.index(req.query);
        res.render('admin/pages/singer/list', {
            titlePage: 'Quản lý ca sĩ',
            singers: data.singers,
            status: data.status,
            sort: data.sort,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            limit: data.limit,
            keyword: data.keyword,
        });
    }

    async create(req: Request, res: Response) {
        res.render('admin/pages/singer/create', {
            titlePage: 'Trang tạo mới ca sĩ',
        });
    }

    async createPost(req: Request, res: Response) {
        try {
            await serviceInstance.createPost(req.body, req.user);
            req.flash('success', 'Tạo mới ca sĩ thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi tạo ca sĩ');
        }
        res.redirect(req.get('Referrer') || '/');
    }

    async detail(req: Request, res: Response) {
        const data = await serviceInstance.detail(req.params.id);
        res.render('admin/pages/singer/detail.pug', { singer: data });
    }

    async edit(req: Request, res: Response) {
        const data = await serviceInstance.edit(req.params.id);
        res.render('admin/pages/singer/edit', { singer: data });
    }

    async editPatch(req: Request, res: Response) {
        try {
            await serviceInstance.editPatch(req.params.id, req.body, req.user);
            req.flash('success', 'Tạo mới ca sĩ thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi tạo ca sĩ');
        }
        res.redirect(req.get('Referrer') || '/');
    }

    async changeStatus(req: Request, res: Response) {
        await serviceInstance.changeStatus(req.params.id, req.body, req.user);
        res.json({status: 'active'});
    }

    async delete(req: Request, res: Response) {
        try {
            await serviceInstance.delete(req.params.id, req.user);
            req.flash('success', 'Xóa ca sĩ thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi xóa ca sĩ!');
        }
        res.redirect(req.get('Referrer') || '/');
    }

    async changeMulti(req: Request, res: Response) {
        try {
            const {ids, action} = req.body;
            const result = await serviceInstance.changeMulti(JSON.parse(ids), action, req.user);
            if (result.result) {
                req.flash('error', result.data.text);
                return res.redirect(req.get('Referrer') || '/');
            }
            req.flash('success', `Cập nhật ${result.data.value} ca sĩ thành công!`);
        } catch (e) {
            req.flash('error', 'Lỗi cập nhật ca sĩ');
        }
        res.redirect(req.get('Referrer') || '/');
    }
}