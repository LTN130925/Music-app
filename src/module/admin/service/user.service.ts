import {UserModel} from '../../../common/model/user.model';
import {BlogUpdatedModel} from '../../../common/model/blog_updated.model'
import {CommentModel} from "../../../common/model/comment.model";

import {convertTextToSlug} from "../../../shared/util/unidecode.util";
import {countUsers} from "../../../shared/helper/cntDocument.helper";
import {pagination} from "../../../shared/util/pagination.util";

import {logicFilterArrayLog} from "../../../shared/logic/filterArrayLog";
const logicInstance = new logicFilterArrayLog();

export class userService {
    async index(q, manager) {
        const filter: any = { managerUser: manager._id, deleted: false };
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
        const countRecords = await countUsers(filter);
        const utilsPagination = pagination(objectPagination, Number(countRecords), q);

        const users = await UserModel.find(filter)
            .skip(utilsPagination.skip)
            .limit(utilsPagination.limit)
            .sort(sortOption)
            .exec();

        return {
            users,
            status: q.status,
            sort: q.sort,
            totalPages: utilsPagination.totalPages,
            currentPage: utilsPagination.currentPage,
            limit: utilsPagination.limit,
            keyword,
        };
    }

    async blog() {
        const filter: any = {deleted: false};
        const getArrayBlog = await UserModel.find(filter)
            .populate({path: 'updatedBlogId', populate: {path: 'list_blog.managerId', select: 'fullName'}})
            .exec();
        logicInstance.setArray(getArrayBlog);
        const record = logicInstance.filterArrayLog();
        return record;
    }

    async detail(id) {
        const user = await UserModel.findOne({ _id: id, deleted: false })
            .populate({path: 'listLikesSong', populate: {path: 'listId', select: 'title'}})
            .populate({path: 'listFavoritesSong', populate: {path: 'listId', select: 'title'}})
            .populate({path: 'listViewsSong', populate: {path: 'listId.idSong', select: 'title'}})
            .populate({path: 'subscribers', populate: {path: 'listId', select: 'fullName'}})
            .populate('messageId')
            .populate('managerUser', 'fullName')
            .select('-password')
            .lean()
            .exec();

        const progressReact = await CommentModel.find({user_id: id})
            .select('likesCount dislikesCount')
            .lean<{
                likesCount: number;
                dislikesCount: number;
            }[]>()
            .exec();

        const [totalPlus, totalMinus] = [
            progressReact.reduce((sum, x) => sum + x.likesCount, 0),
            progressReact.reduce((sum, x) => sum + x.dislikesCount, 0),
        ];

        return {user, totalPlus, totalMinus};
    }

    async changeStatus(id, body, manager): Promise<void> {
        const existing = await UserModel.findById(id);
        if (!existing) throw new Error("Tài khoản không tồn tại");

        await UserModel.findByIdAndUpdate(id, body);
        await BlogUpdatedModel.findByIdAndUpdate(existing.updatedBlogId, {
            $push: {
                list_blog: {
                    managerId: manager._id,
                    title: "Thay đổi trạng thái tài khoản người dùng",
                    updatedAt: new Date(),
                },
            },
        });
    }

    async delete(id, manager): Promise<void> {
        await UserModel.findByIdAndUpdate(id, {
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

        await UserModel.updateMany({ _id: { $in: ids } }, actionData.update);

        const users = await UserModel.find({ _id: { $in: ids } })
            .select("updatedBlogId")
            .exec();

        const blogIds = users.map(m => m.updatedBlogId).filter(Boolean);

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