import {PermissionModel} from '../../../common/model/permission.model';
import {RoleModel} from '../../../common/model/role.model';
import {convertTextToSlug} from "../../../shared/util/unidecode.util";
import {countSongs} from "../../../shared/helper/cntDocument.helper";
import {pagination} from "../../../shared/util/pagination.util";

export class roleService {
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
        const roles = await RoleModel.find(filter)
            .populate('permissions', 'listPermission')
            .skip(utilsPagination.skip)
            .limit(utilsPagination.limit)
            .sort(sortOption)
            .exec();

        return {
            roles,
            status: q.status,
            sort: q.sort,
            totalPages: utilsPagination.totalPages,
            currentPage: utilsPagination.currentPage,
            limit: utilsPagination.limit,
            keyword
        };
    }

    async create(body, manager): Promise<void> {
        const createNewPermission = new PermissionModel();
        await createNewPermission.save();
        const dataRole: Record<string, any> = {
            title: body.title,
            description: body.description,
            permissions: createNewPermission._id,
            createdBy: {
                managerId: manager._id,
                at: new Date()
            }
        };
        const createRoleData = new RoleModel(dataRole);
        await createRoleData.save();
    }

    async detail(id) {
        const filter = {_id: id, deleted: false}
        const role = await RoleModel.findOne(filter)
            .populate('permissions', 'listPermission')
            .populate('createdBy.managerId', 'fullName')
            .exec();
        return role;
    }
}