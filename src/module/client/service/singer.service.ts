import { SingerModel } from '../../../common/model/singer.model';
import {SongModel} from '../../../common/model/song.model';

export class singerService {
    async index(query: any) {

        // 1. FILTER
        const filter: any = { deleted: false };

        // 2. SEARCH
        if (query.search) {
            filter.fullName = { $regex: query.search, $options: 'i' };
        }

        // 3. SORT
        let sort: any = {};

        switch (query.sort) {
            case 'name_asc':
                sort.fullName = 1;
                break;

            case 'name_desc':
                sort.fullName = -1;
                break;

            case 'reg_asc':
                sort.registrationNumber = 1;
                break;

            case 'reg_desc':
                sort.registrationNumber = -1;
                break;

            case 'newest':
                sort.createdAt = -1;
                break;

            case 'oldest':
                sort.createdAt = 1;
                break;

            default:
                sort.createdAt = -1;
        }

        const data = await SingerModel.find(filter).sort(sort);
        return data;
    }

    async detail(query: any, slug: string, body: any): Promise<string> {
        const singer = await SingerModel.findOne({ slug, deleted: false });
        if (!singer) return "Không tìm thấy ca sĩ!";

        const search = query.search as string;
        const sort = query.sort as string;

        let conditions: any = {
            singerId: singer._id,
            deleted: false,
            status: "active",
        };

        if (search) {
            conditions.title = { $regex: search, $options: "i" };
        }

        let sortQuery: any = {};

        switch (sort) {
            case "name_asc": sortQuery.title = 1; break;
            case "name_desc": sortQuery.title = -1; break;
            case "views_asc": sortQuery.views = 1; break;
            case "views_desc": sortQuery.views = -1; break;
            case "newest": sortQuery.createdAt = -1; break;
            case "oldest": sortQuery.createdAt = 1; break;
            default: break;
        }

        const songs = await SongModel.find(conditions)
            .sort(sortQuery);
        body.songs = songs;
        body.singer = singer;
        return '';
    }
}
