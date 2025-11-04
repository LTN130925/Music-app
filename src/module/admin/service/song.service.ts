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
        if (q.sort && q.sort !== 'all' && typeof q.sort === 'string') {
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
        const dataSong: Record<string, any> = {
            title: body.title,
            description: body.description || '',
            topicId: body.topicId,
            singerId: body.singerId,
            lyrics: body.lyrics || '',
            status: body.status,
            avatar: body.avatar ? body.avatar[0] : '',
            audio: body.audio ? body.audio[0] : '',
            slug: slug(body.title),
        }
        const newDataSong = new SongModel(dataSong);
        await newDataSong.save();
    }

    async edit(id, body, user): Promise<void> {
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
        await BlogUpdatedModel.findByIdAndUpdate(user.updatedBlogId, {
            $push: {
                list_blog: {
                    managerId: user._id,
                    updatedAt: new Date()
                }
            }
        });
        await SongModel.findByIdAndUpdate(id, dataSong);
    }

}