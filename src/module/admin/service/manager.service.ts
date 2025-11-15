import bcrypt from 'bcrypt'

import {ManagerModel} from '../../../common/model/manager.model';
import {BlogUpdatedModel} from '../../../common/model/blog_updated.model'
import {RoleModel} from "../../../common/model/role.model";

import {convertTextToSlug} from "../../../shared/util/unidecode.util";
import {countManagers} from "../../../shared/helper/cntDocument.helper";
import {pagination} from "../../../shared/util/pagination.util";

export class songService {
    async index(q) {
        const filter: any = { deleted: false };
        if (q.status && q.status !== "all") filter.status = q.status;

        let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
        if (q.sort && q.sort !== "all") {
            const [key, value] = q.sort.split("-");
            sortOption = { [key]: value === "desc" ? -1 : 1 };
        }

        let keyword = "";
        if (q.q) {
            keyword = q.q;
            const convertText = convertTextToSlug(q.q);
            filter["$or"] = [
                { fullName: new RegExp(q.q, "i") },
                { email: new RegExp(convertText, "i") },
            ];
        }

        const objectPagination = {
            limit: 5,
            currentPage: 1,
        };

        const countRecords = await countManagers(filter);
        const utilsPagination = pagination(objectPagination, Number(countRecords), q);

        const managers = await ManagerModel.find(filter)
            .populate("roleId", "title")
            .skip(utilsPagination.skip)
            .limit(utilsPagination.limit)
            .sort(sortOption)
            .exec();

        return {
            managers,
            status: q.status,
            sort: q.sort,
            totalPages: utilsPagination.totalPages,
            currentPage: utilsPagination.currentPage,
            limit: utilsPagination.limit,
            keyword,
        };
    }

    async detail(id) {
        const manager = await ManagerModel.findOne({ _id: id, deleted: false })
            .populate("roleId", "title")
            .exec();
        return manager;
    }

    async create() {
        const data = await RoleModel.find({deleted: false, status: 'active'})
            .select('title')
            .exec();
        return data;
    }

    async createPost(body, manager): Promise<String> {
        const emailExist = await ManagerModel.findOne({email: body.email, deleted: false}).exec();
        if (emailExist) return 'Tài khoản đã tồn tại, vui lòng nhập email khác!';
        const createDataBlog = new BlogUpdatedModel();
        await createDataBlog.save();

        const dataManager: Record<string, any> = {
            fullName: body.fullName,
            email: body.email,
            phone: body.phone,
            password: await bcrypt.hash(body.password, 10),
            roleId: body.roleId,
            avatar: body.avatar,
            status: body.status,
            description: body.description,
            updatedBlogId: createDataBlog._id,
            createdBy: {
                managerId: manager._id,
                at: new Date(),
            }
        }
        const createNewManager = new ManagerModel(dataManager);
        await createNewManager.save();
        return '';
    }

    async edit(id) {
        const manager = await ManagerModel.findOne({_id: id, deleted: false}).exec();
        const roles = await RoleModel.find({deleted: false, status: 'active'}).select('title').exec();
        return {
            manager,
            roles
        };
    }

    async editPatch(id, body, manager): Promise<string> {
        const existing = await ManagerModel.findById(id);
        if (!existing) return "Id không tồn tại!";

        const emailExists = await ManagerModel.findOne({
            _id: { $ne: id },
            email: body.email,
            deleted: false
        }).exec();
        if (emailExists) return "Email đã tồn tại!";

        const dataUpdate: Record<string, any> = {
            fullName: body.fullName,
            email: body.email,
            phone: body.phone,
            roleId: body.roleId,
            avatar: body.avatar || existing.avatar,
            description: body.description,
            status: body.status,
        };

        if (body.password) {
            dataUpdate.password = await bcrypt.hash(body.password, 10);
        }
        await BlogUpdatedModel.findByIdAndUpdate(existing.updatedBlogId, {
            $push: {
                list_blog: {
                    managerId: manager._id,
                    title: "Chỉnh sửa tài khoản quản lý",
                    updatedAt: new Date(),
                },
            },
        });

        await ManagerModel.findByIdAndUpdate(id, dataUpdate);
        return '';
    }

    async changeStatus(id, body, manager): Promise<void> {
        const existing = await ManagerModel.findById(id);
        if (!existing) throw new Error("Tài khoản không tồn tại");

        await ManagerModel.findByIdAndUpdate(id, body);
        await BlogUpdatedModel.findByIdAndUpdate(existing.updatedBlogId, {
            $push: {
                list_blog: {
                    managerId: manager._id,
                    title: "Thay đổi trạng thái tài khoản",
                    updatedAt: new Date(),
                },
            },
        });
    }

    async delete(id, manager): Promise<void> {
        await ManagerModel.findByIdAndUpdate(id, {
            deleted: true,
            deletedBy: {
                managerId: manager._id,
                at: new Date(),
            },
            deletedAt: new Date(),
        });
    }

    async changeMulti(ids, action, manager) {
        const actionsMap: Record<string, any> = {
            active: {
                update: { status: "active" },
                log: { title: "Kích hoạt tài khoản" },
            },
            inactive: {
                update: { status: "inactive" },
                log: { title: "Ẩn tài khoản" },
            },
            delete: {
                update: { deleted: true },
                log: { title: "Xóa tài khoản" },
            },
        };

        const actionData = actionsMap[action];
        if (!actionData) return { result: true, data: { text: "Lỗi dữ liệu" } };

        await ManagerModel.updateMany({ _id: { $in: ids } }, actionData.update);

        const managers = await ManagerModel.find({ _id: { $in: ids } })
            .select("updatedBlogId")
            .exec();

        const blogIds = managers.map(m => m.updatedBlogId).filter(Boolean);

        await BlogUpdatedModel.updateMany(
            { _id: { $in: blogIds } },
            {
                $push: {
                    list_blog: {
                        managerId: manager._id,
                        title: actionData.log.title,
                        updatedAt: new Date(),
                    },
                },
            }
        );

        return { result: false, data: { value: ids.length } };
    }
}