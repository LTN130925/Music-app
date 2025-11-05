import {SingerModel} from '../../../common/model/singer.model';

import {ISinger} from '../../../common/model/singer.model';
import {BlogUpdatedModel} from '../../../common/model/blog_updated.model';
import slug from 'slug';

export class singerService {
    async index(): Promise<ISinger[]> {
        const filter = {deleted: false, status: 'active'};
        const singers = await SingerModel.find(filter);
        return singers;
    }

    async detail(id) {
        const filter = {_id: id, deleted: false};
        const singer = await SingerModel.findOne(filter).exec();
        return singer;
    }

    async edit(id) {
        const filter = {_id: id, deleted: false};
        const singer = await SingerModel.findOne(filter).exec();
        return singer;
    }

    async createPost(body, user): Promise<void> {
        const newBlog = new BlogUpdatedModel();
        const dataSinger: Record<string, any> = {
            fullName: body.fullName,
            slug: slug(body.fullName),
            status: body.status,
            avatar: body.avatar || '',
            updatedBlogId: newBlog._id,
            createdBy: {
                managerId: user._id,
                at: new Date()
            }
        };

        const newSinger = new SingerModel(dataSinger);
        await newBlog.save();
        await newSinger.save();
    }

    async editPatch(id, body, manager): Promise<void> {
        const existingSinger = await SingerModel.findById(id);
        if (!existingSinger) throw new Error('Ca sĩ không tồn tại');

        const dataSinger: Record<string, any> = {
            fullName: body.fullName,
            slug: body.slug ? slug(body.fullName) : '',
            description: body.description,
            status: body.status,
            avatar: body.avatar || existingSinger.avatar,
        };
        await BlogUpdatedModel.findByIdAndUpdate(existingSinger.updatedBlogId, {
            $push: {
                list_blog: {
                    managerId: manager._id,
                    title: 'Chỉnh sửa ca sĩ',
                    updatedAt: new Date(),
                },
            },
        });

        await SingerModel.findByIdAndUpdate(id, dataSinger);
    }
}