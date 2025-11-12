import slug from "slug";

import {TopicModel} from '../../../common/model/topic.model';
import {BlogUpdatedModel} from '../../../common/model/blog_updated.model';

import {convertTextToSlug} from '../../../shared/util/unidecode.util';
import {countSongs} from '../../../shared/helper/cntDocument.helper';
import {pagination} from '../../../shared/util/pagination.util';


export class topicService {
    async index(q) {
        const filter: any = { deleted: false };
        if (q.status && q.status !== 'all') filter.status = q.status;

        let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
        if (q.sort && q.sort !== 'all') {
            const [key, value] = q.sort.split('-');
            sortOption = { [key]: value === 'desc' ? -1 : 1 };
        }

        let keyword = '';
        if (q.q) {
            keyword = q.q;
            const convertText = convertTextToSlug(q.q);
            filter['$or'] = [
                { title: new RegExp(q.q, 'i') },
                { slug: new RegExp(convertText, 'i') },
            ];
        }

        const objectPagination = {
            limit: 5,
            currentPage: 1,
        };

        const countRecords = await countSongs(filter);
        const utilsPagination = pagination(objectPagination, Number(countRecords), q);

        const topics = await TopicModel.find(filter)
            .skip(utilsPagination.skip)
            .limit(utilsPagination.limit)
            .sort(sortOption)
            .exec();

        return {
            topics,
            status: q.status,
            sort: q.sort,
            totalPages: utilsPagination.totalPages,
            currentPage: utilsPagination.currentPage,
            limit: utilsPagination.limit,
            keyword,
        };
    }

    async detail(id) {
        const topic = await TopicModel.findOne({ _id: id, deleted: false }).exec();
        return topic;
    }

    async createPost(body, manager): Promise<void> {
        const newBlog = new BlogUpdatedModel();
        const dataTopic: Record<string, any> = {
            title: body.title,
            description: body.description || '',
            slug: slug(body.title),
            avatar: body.avatar || '',
            status: body.status,
            updatedBlogId: newBlog._id,
            createdBy: {
                managerId: manager._id,
                at: new Date(),
            },
        };

        const newTopic = new TopicModel(dataTopic);
        await newBlog.save();
        await newTopic.save();
    }

    async edit(id) {
        const topic = await TopicModel.findOne({ _id: id, deleted: false }).exec();
        return topic;
    }

    async editPatch(id, body, manager): Promise<void> {
        const existingTopic = await TopicModel.findById(id);
        if (!existingTopic) throw new Error('Chủ đề không tồn tại');

        const dataTopic: Record<string, any> = {
            title: body.title,
            description: body.description,
            slug: slug(body.title),
            avatar: body.avatar || existingTopic.avatar,
            status: body.status,
        };

        await BlogUpdatedModel.findByIdAndUpdate(existingTopic.updatedBlogId, {
            $push: {
                list_blog: {
                    managerId: manager._id,
                    title: 'Chỉnh sửa chủ đề',
                    updatedAt: new Date(),
                },
            },
        });

        await TopicModel.findByIdAndUpdate(id, dataTopic);
    }

    async changeStatus(id, body, manager): Promise<void> {
        const existingTopic = await TopicModel.findById(id);
        if (!existingTopic) throw new Error('Chủ đề không tồn tại');

        await TopicModel.findByIdAndUpdate(id, body);
        await BlogUpdatedModel.findByIdAndUpdate(existingTopic.updatedBlogId, {
            $push: {
                list_blog: {
                    managerId: manager._id,
                    title: 'Thay đổi trạng thái chủ đề',
                    updatedAt: new Date(),
                },
            },
        });
    }

    async delete(id, manager): Promise<void> {
        await TopicModel.findByIdAndUpdate(id, {
            deleted: true,
            deletedBy: {
                managerId: manager._id,
                at: new Date(),
            },
            deletedAt: new Date(),
        });
    }

}