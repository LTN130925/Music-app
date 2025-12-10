import slug from 'slug';

import {SingerModel} from '../../../common/model/singer.model';
import {BlogUpdatedModel} from '../../../common/model/blog_updated.model';

import {convertTextToSlug} from "../../../shared/util/unidecode.util";
import {countSingers} from "../../../shared/helper/cntDocument.helper";
import {pagination} from "../../../shared/util/pagination.util";

import {logicFilterArrayLog} from "../../../shared/logic/filterArrayLog";
const logicInstance = new logicFilterArrayLog();

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
        const countRecords = await countSingers(filter);
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

    async blog() {
        const filter: any = {deleted: false};
        const getArrayBlog = await SingerModel.find(filter)
            .populate({path: 'updatedBlogId', populate: {path: 'list_blog.managerId', select: 'fullName'}})
            .exec();
        logicInstance.setArray(getArrayBlog);
        const record = logicInstance.filterArrayLog();
        return record;
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
            featured: body.featured === 'true' ? true : false,
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
            featured: body.featured === 'true' ? true : false,
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

    async changeStatus(id, body, manager): Promise<void> {
        const existingSinger = await SingerModel.findById(id);
        if (!existingSinger) throw new Error('Ca sĩ không tồn tại');

        await SingerModel.findByIdAndUpdate(id, body);
        await BlogUpdatedModel.findByIdAndUpdate(existingSinger.updatedBlogId, {
            $push: {
                list_blog: {
                    managerId: manager._id,
                    title: 'Sửa trạng thái ca sĩ',
                    updatedAt: new Date()
                }
            }
        });
    }

    async delete(id, manager): Promise<void> {
        await SingerModel.findByIdAndUpdate(id, {
            deleted: true,
            deletedBy: {
                managerId: manager._id,
                at: new Date()
            }
        });
    }

    async changeMulti(ids, action, manager): Promise<{result: boolean; data: {text?: string; value?: number}}> {
        const actionsMap: Record<string, any> = {
            active: {
                update: { status: 'active' },
                log: { title: 'Kích hoạt ca sĩ' }
            },
            inactive: {
                update: { status: 'inactive' },
                log: { title: 'Ẩn ca sĩ' }
            },
            delete: {
                update: { deleted: true },
                log: { title: 'Xóa ca sĩ' }
            }
        };

        const actionData = actionsMap[action];
        if (!actionData) return { result: true, data: { text: 'Lỗi dữ liệu' } };

        await SingerModel.updateMany(
            { _id: { $in: ids }} ,
            actionData.update
        );
        const singers = await SingerModel.find({ _id: { $in: ids }}).select('updatedBlogId').exec();
        const blogIds = singers.map(singer => singer.updatedBlogId).filter(Boolean);

        await BlogUpdatedModel.updateMany(
            {_id: {$in: blogIds}},
            {
                $push: {
                    list_blog: {
                        managerId: manager._id,
                        title: actionData.log.title,
                        updatedAt: new Date()
                    }
                }
            }
        );
        return {result: false, data: {value: ids.length}};
    }
}