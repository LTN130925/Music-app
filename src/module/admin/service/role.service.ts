import {PermissionModel} from '../../../common/model/permission.model';
import {RoleModel} from '../../../common/model/role.model';

export class roleService {
    async index() {
        const roles = await RoleModel.find({deleted: false, status: 'active'})
            .populate('permissions', 'listPermission')
            .exec();
        return roles;
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
}