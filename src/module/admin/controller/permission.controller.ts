import {Request, Response} from 'express';

import dataPermission from '../../../common/data/modules-permissions.data';
import dataRole from '../../../common/data/modules-roles.data';
import {RoleModel} from '../../../common/model/role.model';

import {permissionService} from '../service/permission.service';
const serviceInstance = new permissionService();

export class controller {
    async index(req: Request, res: Response) {
        res.render('admin/pages/permission/permission', {
            moduleList: dataPermission,
            roles: await serviceInstance.permission(),
        });
    }

    async update(req: Request, res: Response) {
        try {
            const data = JSON.parse(req.body.permissions);
            const result = await serviceInstance.updateDataRoles(data, req.user);
            if (result) {
                req.flash('error', result as string);
                return res.redirect(req.get('Referrer') || '/');
            }
            req.flash('success', 'Cập nhật phân quyền thành công');
        } catch (e) {
            req.flash('error', 'Cập nhật thất bại!');
        }
        return res.redirect(req.get('Referrer') || '/');
    }

    async debug(req: Request, res: Response) {
        const roles = await RoleModel.find({status: 'active', deleted: false}).populate('permissions').exec();
        res.status(200).json(roles);
    }
}