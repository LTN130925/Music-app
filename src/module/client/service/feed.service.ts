import {SubscribersModel} from '../../../common/model/subscribers.model';
import {SingerModel} from '../../../common/model/singer.model';

export class feedService {
    async getSubscribers(user, q) {
        const record = await SubscribersModel.findById(user.subscribers).exec();
        const filter = {_id: { $in: record.listId }, deleted: false};

        if (q.search) {
            filter['fullName'] = { $regex: q.search, $options: 'i' };
        }

        let sort: any = {};
        switch (q.sort) {
            case 'name_asc': sort.fullName = 1; break;
            case 'name_desc': sort.fullName = -1; break;
            case 'reg_asc': sort.registrationNumber = 1; break;
            case 'reg_desc': sort.registrationNumber = -1; break;
            case 'newest': sort.createdAt = -1; break;
            case 'oldest': sort.createdAt = 1; break;
            default: sort.createdAt = -1;
        }
        const feedSingerSubscriber = await SingerModel.find(filter)
            .sort(sort)
            .exec();
        return feedSingerSubscriber;
    }
}