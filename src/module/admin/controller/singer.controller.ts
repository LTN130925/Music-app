import {Request, Response} from 'express';

import {singerService} from '../service/singer.service';
const serviceInstance = new singerService();

export class controller {
    async index(req: Request, res: Response) {
        const singers = await serviceInstance.index();
        res.render('admin/pages/singer/list', { singers });
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
        res.render('admin/pages/singer/detail', { singer: data });
    }

    async edit(req: Request, res: Response) {
        const data = await serviceInstance.edit(req.params.id);
        res.render('admin/pages/singer/edit', { singer: data });
    }
}