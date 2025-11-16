import { SingerModel } from '../../../common/model/singer.model';

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
}
