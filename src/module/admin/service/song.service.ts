import slug from 'slug';

import {SongModel} from '../../../common/model/song.model';
import {BlogUpdatedModel} from '../../../common/model/blog_updated.model';
import {SingerModel} from '../../../common/model/singer.model';
import {TopicModel} from "../../../common/model/topic.model";
import {UserModel} from "../../../common/model/user.model";
import {MassagesModel} from '../../../common/model/message.model';
import {SubscribersModel} from "../../../common/model/subscribers.model";

import {convertTextToSlug} from "../../../shared/util/unidecode.util";

import {pagination} from '../../../shared/util/pagination.util';
import {countSongs} from '../../../shared/helper/cntDocument.helper';

import {logicFilterArrayLog} from "../../../shared/logic/filterArrayLog";
const logicInstance = new logicFilterArrayLog();

export class songService {
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
        const songs = await SongModel.find(filter)
            .populate('singerId', 'fullName')
            .populate('topicId', 'title')
            .skip(utilsPagination.skip)
            .limit(utilsPagination.limit)
            .sort(sortOption)
            .exec();

        return {
            songs,
            status: q.status,
            sort: q.sort,
            totalPages: utilsPagination.totalPages,
            currentPage: utilsPagination.currentPage,
            limit: utilsPagination.limit,
            keyword
        };
    }

    async blog() {
        const filter: any = {deleted: false, status: 'active'};
        const getArrayBlog = await SongModel.find(filter)
            .populate({path: 'updatedBlogId', populate: {path: 'list_blog.managerId', select: 'fullName'}})
            .exec();
        logicInstance.setArray(getArrayBlog);
        const record = logicInstance.filterArrayLog();
        return record;
    }

    async detail(id) {
        const data = await SongModel.findOne({_id: id, deleted: false})
            .populate('singerId', 'fullName')
            .populate('topicId', 'title')
            .exec()
        return data;
    }

    async create() {
        const filter = {status: 'active', deleted: false};
        const [singers, topics] = await Promise.all([
            SingerModel.find(filter).select('fullName'),
            TopicModel.find(filter).select('title')
        ])
        return { singers, topics }
    }

    async createPost(body, manager): Promise<void> {
        const newBlog = new BlogUpdatedModel();
        const dataSong: Record<string, any> = {
            title: body.title,
            description: body.description || '',
            topicId: body.topicId,
            singerId: body.singerId,
            lyrics: body.lyrics || '',
            status: body.status,
            featured: body.featured === 'true' ? true : false,
            updatedBlogId: newBlog._id,
            avatar: body.avatar ? body.avatar[0] : '',
            audio: body.audio ? body.audio[0] : '',
            slug: slug(body.title),
            createdBy: {
                managerId: manager._id,
                at: new Date()
            }
        }
        const newDataSong = new SongModel(dataSong);
        await newBlog.save();
        await newDataSong.save();

        await this.pushNotificationToSubscribers(newDataSong);
    }

    async pushNotificationToSubscribers(song) {
        const subsDocs = await SubscribersModel.find({
            listId: song.singerId.toString(),
        });
        const subsIds = subsDocs.map(s => s._id);
        const followers = await UserModel.find({subscribers: { $in: subsIds }})
            .populate('messageId')
            .exec();

        const singer = await SingerModel.findOne({
            _id: song.singerId,
            deleted: false
        }).exec();

        for (const user of followers) {
            await MassagesModel.findByIdAndUpdate(
                user.messageId,
                {
                    $push: {
                        listId: {
                            singer: singer._id,
                            title: song.title,
                            description: `Ca sỹ ${singer.fullName} đã có bài hát mới. Trải nghiệm ngay!`,
                            link: `/notification/${song.slug}`
                        }
                    }
                }
            );
        }
    }


    async edit(id) {
        const filter = {status: 'active', deleted: false};
        const [song, singers, topics] = await Promise.all([
            SongModel.findOne({_id: id, deleted: false}).exec(),
            SingerModel.find(filter).select('fullName').exec(),
            TopicModel.find(filter).select('title').exec()
        ])
        return { song, singers, topics }
    }

    async editPatch(id, body, manager): Promise<void> {
        const existingSong = await SongModel.findById(id);
        if (!existingSong) throw new Error('Bài hát không tồn tại');

        const dataSong: Record<string, any> = {
            title: body.title,
            description: body.description || '',
            topicId: body.topicId,
            singerId: body.singerId,
            lyrics: body.lyrics || '',
            status: body.status,
            featured: body.featured === 'true' ? true : false,
            avatar: body.avatar?.[0] || existingSong.avatar,
            audio: body.audio?.[0] || existingSong.audio,
        };
        await BlogUpdatedModel.findByIdAndUpdate(existingSong.updatedBlogId, {
            $push: {
                list_blog: {
                    managerId: manager._id,
                    title: 'chỉnh sửa bài hát',
                    updatedAt: new Date()
                }
            }
        });
        await SongModel.findByIdAndUpdate(id, dataSong);
    }

    async changeStatus(id, body, manager): Promise<void> {
        const existingSong = await SongModel.findById(id);
        if (!existingSong) throw new Error('Bài hát không tồn tại');

        await SongModel.findByIdAndUpdate(id, body);
        await BlogUpdatedModel.findByIdAndUpdate(existingSong.updatedBlogId, {
            $push: {
                list_blog: {
                    managerId: manager._id,
                    title: 'Sửa trạng thái bài hát',
                    updatedAt: new Date()
                }
            }
        });
    }

    async delete(id, manager): Promise<void> {
        await SongModel.findByIdAndUpdate(id, {
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
                log: { title: 'Kích hoạt bài hát' }
            },
            inactive: {
                update: { status: 'inactive' },
                log: { title: 'Ẩn bài hát' }
            },
            delete: {
                update: { deleted: true },
                log: { title: 'Xóa bài hát' }
            }
        };

        const actionData = actionsMap[action];
        if (!actionData) return { result: true, data: { text: 'Lỗi dữ liệu' } };

        await SongModel.updateMany(
            { _id: { $in: ids }} ,
            actionData.update
        );
        const songs = await SongModel.find({ _id: { $in: ids }}).select('updatedBlogId').exec();
        const blogIds = songs.map(song => song.updatedBlogId).filter(Boolean);

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