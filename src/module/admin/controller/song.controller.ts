import {Request, Response} from 'express';

import {songService} from '../service/song.service';
const serviceInstance = new songService();

export class controller {
    async index(req: Request, res: Response) {
        const data = await serviceInstance.index(req.query);
        res.render('admin/pages/songs/list', {
            titlePage: 'Quản lý bài hát',
            songs: data.songs,
            status: data.status,
            sort: data.sort,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            limit: data.limit,
            keyword: data.keyword,
        });
    }

    async create(req: Request, res: Response) {
        const data = await serviceInstance.create();
        res.render('admin/pages/songs/create.pug', {
            titlePage: 'Thêm mới bài hát',
            singers: data.singers,
            topics: data.topics,
        });
    }

    async createPost(req: Request, res: Response) {
        try {
            await serviceInstance.createPost(req.body);
            req.flash('success', 'Tạo mới bài hát thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi tạo bài hát');
        }
        res.redirect(req.get('Referrer') || '/');
    }

    async edit(req: Request, res: Response) {
        const data = await serviceInstance.edit(req.params.id)
        res.render('admin/pages/songs/edit.pug', {
            titlePage: 'Trang chỉnh sửa',
            song: data.song,
            singers: data.singers,
            topics: data.topics,
        });
    }

    async editPatch(req: Request, res: Response) {
        try {
            await serviceInstance.editPatch(req.params.id, req.body, req.user);
            req.flash('success', 'Cập nhật bài hát thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi cập nhật bài hát bài hát');
        }
        res.redirect(req.get('Referrer') || '/');
    }

    async detail(req: Request, res: Response) {
        const song = await serviceInstance.detail(req.params.id);
        res.render('admin/pages/songs/detail.pug', {
            titlePage: 'Trang chi tiết',
            song
        })
    }

    async changeStatus(req: Request, res: Response) {
        await serviceInstance.changeStatus(req.params.id, req.body, req.user);
        res.json({status: 'active'});
    }

    async delete(req: Request, res: Response) {
        try {
            await serviceInstance.delete(req.params.id, req.user);
            req.flash('success', 'Xóa bài hát thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi xóa bài hát!');
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
            req.flash('success', `Cập nhật ${result.data.value} bài hát thành công!`);
        } catch (e) {
            req.flash('error', 'Lỗi cập nhật bài hát bài hát');
        }
        res.redirect(req.get('Referrer') || '/');
    }
}