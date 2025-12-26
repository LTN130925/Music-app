import {Request, Response} from 'express';

import {songService} from '../service/manager.service';
const serviceInstance = new songService();

export class controller {
    async index(req: Request, res: Response) {
        const data = await serviceInstance.index(req.query);
        res.render('admin/pages/manager/list', {
            titlePage: 'Trang quản lý',
            managers: data.managers,
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
            titlePage: 'Lịch sử chỉnh sửa quản lý',
            history: data,
        });
    }

    async detail(req: Request, res: Response) {
        const data = await serviceInstance.detail(req.params.id);
        res.render('admin/pages/manager/detail', {
            titlePage: 'Trang chi tiết tài khoản',
            mana: data,
        })
    }

    async create(req: Request, res: Response) {
        const data = await serviceInstance.create();
        res.render('admin/pages/manager/create.pug', {
            titlePage: 'Trang tạo tài khoản quản lý',
            roles: data,
        });
    }

    async createPost(req: Request, res: Response) {
        const result = await serviceInstance.createPost(req.body, req.user);
        if (!result) {
            req.flash('error', 'email đã tồn tại, vui lòng tạo tài khoản với email mới!');
            return res.redirect(req.get('Referrer') || '/');
        }
        req.session['dataObject'] = result;
        req.session['path'] = 'create-manager'
        res.redirect('/server/verification/otp');
    }

    async edit(req: Request, res: Response) {
        const data = await serviceInstance.edit(req.params.id)
        res.render('admin/pages/manager/edit.pug', {
            titlePage: 'Trang chỉnh sửa',
            ...data,
        })
    }

    async editPatch(req: Request, res: Response) {
        const result = await serviceInstance.editPatch(req.params.id, req.body, req.user['email']);
        if (!result) {
            req.flash('error', 'Không tồn tại tài khoản quản trị hoặc trùng email quản trị');
            return res.redirect(req.get('Referrer') || '/');
        }
        req.session['dataObject'] = result;
        req.session['path'] = 'edit-manager';
        res.redirect('/server/verification/otp');
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