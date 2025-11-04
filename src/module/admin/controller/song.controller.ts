import {Request, Response} from 'express';

import {SingerModel} from '../../../common/model/singer.model';
import {TopicModel} from '../../../common/model/topic.model';
import {SongModel} from "../../../common/model/song.model";

import {songService} from '../service/song.service';
import {asyncWrapProviders} from "node:async_hooks";
const serviceInstance = new songService();

export class controller {
    async index(req: Request, res: Response) {
        const data = await serviceInstance.index(req.query);
        res.render('admin/pages/songs/list', {
            titlePage: 'Quản lý bài hát',
            songs: data.songs,
            status: data.status,
            sort: data.sort,
        });
    }

    async create(req: Request, res: Response) {
        const filter = {status: 'active', deleted: false};
        res.render('admin/pages/songs/create.pug', {
            titlePage: 'Thêm mới bài hát',
            singers: await SingerModel.find(filter).select('fullName'),
            topics: await TopicModel.find(filter).select('title')
        });
    }

    async createPost(req: Request, res: Response) {
        try {
            await serviceInstance.create(req.body);
            req.flash('success', 'Tạo mới bài hát thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi tạo bài hát');
        }
        res.redirect(req.get('Referrer') || '/');
    }

    async editPatch(req: Request, res: Response) {
        try {
            await serviceInstance.edit(req.params.id, req.body, req.user);
            req.flash('success', 'Cập nhật bài hát thành công!');
        } catch (e) {
            req.flash('error', 'Lỗi cập nhật bài hát bài hát');
        }
        res.redirect(req.get('Referrer') || '/');
    }

    async edit(req: Request, res: Response) {
        res.render('admin/pages/songs/edit.pug', {
            titlePage: 'Trang chỉnh sửa',
            song: await SongModel.findOne({_id: req.params.id, deleted: false}).exec(),
            singers: await SingerModel.find({deleted: false, status: 'active'}).select('fullName').exec(),
            topics: await TopicModel.find({deleted: false, status: 'active'}).select('title').exec(),
        });
    }

    async detail(req: Request, res: Response) {
        res.render('admin/pages/songs/detail.pug', {
            titlePage: 'Trang chi tiết',
            song: await SongModel.findOne({_id: req.params.id, status: 'active', deleted: false})
                .populate('singerId', 'fullName')
                .populate('topicId', 'title')
                .exec()
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