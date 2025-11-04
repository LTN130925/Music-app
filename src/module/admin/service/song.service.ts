import slug from 'slug';

import {SongModel} from '../../../common/model/song.model';
import {BlogUpdatedModel} from '../../../common/model/blog_updated.model';

import {ISong} from '../../../common/model/song.model';
import {convertTextToSlug} from "../../../shared/ulti/unidecode.ulti";

export class songService {
    async index(q): Promise<{ songs: ISong[]; status: string; sort: string }> {
        const filter: any = {status: 'active', deleted: false};
        if (q.status) filter.status = q.status === 'all' || q.status === 'active' ? 'active' : 'inactive';

        let sortOption: Record<string, 1 | -1> = {createdAt: -1}
        if (q.sort && q.sort !== 'all') {
            const [key, value] = q.sort.split('-');
            sortOption = { [key]: value === 'desc' ? -1 : 1 };
        }

        if (q.q) {
            const convertText = convertTextToSlug(q.q);
            filter['$or'] = [
                { title: new RegExp(q.q, 'i') },
                { slug: new RegExp(convertText, 'i') },
            ];
        }

        const songs = await SongModel.find(filter)
            .populate('singerId', 'fullName')
            .populate('topicId', 'title')
            .sort(sortOption)
            .exec();
        return {
            songs,
            status: q.status,
            sort: q.sort,
        };
    }

    async create(body): Promise<void> {
        const newBlog = new BlogUpdatedModel();
        const dataSong: Record<string, any> = {
            title: body.title,
            description: body.description || '',
            topicId: body.topicId,
            singerId: body.singerId,
            lyrics: body.lyrics || '',
            status: body.status,
            updatedBlogId: newBlog._id,
            avatar: body.avatar ? body.avatar[0] : '',
            audio: body.audio ? body.audio[0] : '',
            slug: slug(body.title),
        }

        const newDataSong = new SongModel(dataSong);
        await newBlog.save();
        await newDataSong.save();
    }

    async edit(id, body, manager): Promise<void> {
        const existingSong = await SongModel.findById(id);
        if (!existingSong) throw new Error('Bài hát không tồn tại');

        const dataSong: Record<string, any> = {
            title: body.title,
            description: body.description || '',
            topicId: body.topicId,
            singerId: body.singerId,
            lyrics: body.lyrics || '',
            status: body.status,
            avatar: body.avatar?.[0] || existingSong.avatar,
            audio: body.audio?.[0] || existingSong.audio,
        };
        await BlogUpdatedModel.findByIdAndUpdate(manager.updatedBlogId, {
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
        await SongModel.findByIdAndUpdate(id, body);
        await BlogUpdatedModel.findByIdAndUpdate(manager.updatedBlogId, {
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