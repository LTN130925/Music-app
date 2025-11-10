import {Request, Response} from 'express';

// service
import {topicService} from '../service/topic.service';
const serviceInstance = new topicService();

export class controller {
    async index(req: Request, res: Response) {
        const data = await serviceInstance.index(req.query);
        res.render('admin/pages/topics/list', {
            titlePage: 'Quản lý chủ đề',
            topics: data.topics,
            status: data.status,
            sort: data.sort,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            limit: data.limit,
            keyword: data.keyword,
        });
    }

    async detail(req: Request, res: Response) {
        const data = await serviceInstance.detail(req.params.id);
        res.render('admin/pages/topics/detail', {
            titlePage: 'Chi tiết chủ đề',
            topic: data,
        });
    }

    create(req: Request, res: Response) {
        res.render('admin/pages/topics/create', {
            titlePage: 'Trang tạo mới chủ đề',
        });
    }
}