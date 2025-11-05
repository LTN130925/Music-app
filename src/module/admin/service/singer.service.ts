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

    async detail(id: string) {
        const filter = {_id: id, deleted: false};
        const singer = await SingerModel.findOne(filter).exec();
        return singer;
    }

    async createPost(body, user): Promise<void> {
        const newBlog = new BlogUpdatedModel();
        const dataSinger: Record<string, any> = {
            fullName: body.fullName,
            slug: slug(body.fullName),
            status: body.status || 'active',
            avatar: body.avatar ? body.avatar[0] : '',
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
}