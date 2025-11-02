import {RoleModel} from '../../../common/model/role.model';
import {PermissionModel} from '../../../common/model/permission.model';

export class permissionService {
    async permission() {
        const roles = await RoleModel.find({status: 'active', deleted: false}).populate('permissions').exec();
        return roles;
    }

    async updateDataRoles(data): Promise<string> {
        for (const item of data) {
            const role = await RoleModel.findOne({_id: item.role_id, deleted: false, status: 'active'})
                .select('permissions')
                .exec();
            if (!role) return 'Id không tồn tại!'
            await PermissionModel.findByIdAndUpdate(
                role.permissions,
                {listPermission: item.permissions}
            )
        }
        return '';
    }
}