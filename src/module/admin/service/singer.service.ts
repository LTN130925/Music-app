import {SingerModel} from '../../../common/model/singer.model';

import {ISinger} from '../../../common/model/singer.model';
import {BlogUpdatedModel} from '../../../common/model/blog_updated.model';
import slug from 'slug';
import {convertTextToSlug} from "../../../shared/util/unidecode.util";
import {countSongs} from "../../../shared/helper/cntDocument.helper";
import {pagination} from "../../../shared/util/pagination.util";

export class singerService {
    async index(q) {
        const filter: any = {deleted: false};
        if (q.status && q.status !== 'all') filter.status = q.status;

        let sortOption: Record<string, 1 | -1> = {createdAt: -1}
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
        }
        const countRecords = await countSongs(filter);
        const utilsPagination = pagination(objectPagination, Number(countRecords), q);

        const singers = await SingerModel.find(filter)
            .skip(utilsPagination.skip)
            .limit(utilsPagination.limit)
            .sort(sortOption)
            .exec();

        return {
            singers,
            status: q.status,
            sort: q.sort,
            totalPages: utilsPagination.totalPages,
            currentPage: utilsPagination.currentPage,
            limit: utilsPagination.limit,
            keyword
        };
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