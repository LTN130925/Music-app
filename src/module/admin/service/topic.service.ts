import {TopicModel} from '../../../common/model/topic.model';

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
}