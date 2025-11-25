import {PermissionModel} from '../../../common/model/permission.model';
import {RoleModel} from '../../../common/model/role.model';
import {BlogUpdatedModel} from "../../../common/model/blog_updated.model";

import {convertTextToSlug} from "../../../shared/util/unidecode.util";
import {countRoles} from "../../../shared/helper/cntDocument.helper";
import {pagination} from "../../../shared/util/pagination.util";

import {dictRoleMain} from '../../../shared/helper/dataRole.helper'

export class roleService {
    async index(q) {
        const filter: any = {deleted: false};
        if (q.status && q.status !== 'all') filter.status = q.status;

        let sortOption: Record<string, 1 | -1> = {createdAt: -1}
        if (q.sort && q.sort !== 'all') {
            const [key, value] = q.sort.split('-');
            sortOption = {[key]: value === 'desc' ? -1 : 1};
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
        const countRecords = await countRoles(filter);
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

    create() {
        const dictRole: Record<string, string> = {
            'Quản trị viên': 'admin-server',
            'Quản trị người dùng': 'admin-user',
            'Quản trị ca sĩ': 'admin-singer',
            'Quản trị tài khoản quản lý': 'admin-manager',
            'Quản trị vai trò': 'admin-role'
        }
        const roles = Object.entries(dictRole).map(([title, value]) => ({
            _id: value,
            title
        }));

        return roles;
    }

    async createPost(body, manager): Promise<void> {
        const newBlog = new BlogUpdatedModel();
        const newPermission = new PermissionModel();
        const dataRole = {
            title: body.title,
            description: body.description,
            permissions: newPermission._id,
            updatedBlogId: newBlog._id,
            role: body.role,
            status: body.status,
            createdBy: {
                managerId: manager._id,
                at: new Date()
            }
        };
        newPermission.listPermission = dictRoleMain[body.role];
        const createRoleData = new RoleModel(dataRole);
        await newPermission.save();
        await newBlog.save();
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

    async edit(id) {
        const filter = {_id: id, deleted: false}
        const role = await RoleModel.findOne(filter).exec();
        const roleDataSelect = this.create();
        return {
            role,
            roleDataSelect
        };
    }

    async editPatch(id, body, manager) {
        const existingRole = await RoleModel.findById(id);
        if (!existingRole) throw new Error('Chức vụ không tồn tại');

        const dataRole = {
            title: body.title,
            description: body.description,
            status: body.status,
            role: body.role,
        };
        await PermissionModel.findByIdAndUpdate(
            existingRole.permissions,
            { listPermission: dictRoleMain[body.role] },
        )
        await BlogUpdatedModel.findByIdAndUpdate(existingRole.updatedBlogId, {
            $push: {
                list_blog: {
                    managerId: manager._id,
                    title: 'chỉnh sửa chức vụ ',
                    updatedAt: new Date()
                }
            }
        });

        await RoleModel.findByIdAndUpdate(id, dataRole);
    }

    async changeStatus(id, body, manager): Promise<void> {
        const existingRole = await RoleModel.findById(id);
        if (!existingRole) throw new Error('Chức vụ không tồn tại');

        await RoleModel.findByIdAndUpdate(id, body);
        await BlogUpdatedModel.findByIdAndUpdate(existingRole.updatedBlogId, {
            $push: {
                list_blog: {
                    managerId: manager._id,
                    title: 'Sửa trạng thái nhóm quyền',
                    updatedAt: new Date()
                }
            }
        });
    }

    async delete(id, manager) {
        await RoleModel.findByIdAndUpdate(id, {
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
                log: { title: 'Kích hoạt chức quyền' }
            },
            inactive: {
                update: { status: 'inactive' },
                log: { title: 'Ẩn chức quyền' }
            },
            delete: {
                update: { deleted: true },
                log: { title: 'Xóa chức quyền' }
            }
        };

        const actionData = actionsMap[action];
        if (!actionData) return { result: true, data: { text: 'Lỗi dữ liệu' } };

        await RoleModel.updateMany(
            { _id: { $in: ids }},
            actionData.update
        );
        const songs = await RoleModel.find({ _id: { $in: ids }}).select('updatedBlogId').exec();
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