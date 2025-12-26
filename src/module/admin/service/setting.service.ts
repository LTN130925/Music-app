import {SettingModel} from "../../../common/model/general-setting.model";

export class settingService {
    async getSettingGeneral() {
        const settingData = await SettingModel.findOne({});
        return settingData;
    }

    async createSetting(body: any) {
        const data = await this.getSettingGeneral();
        const payload = {
            ...body,
            maintenance: body.maintenance === "on" || body.maintenance === true
        };

        if (!data) {
            await SettingModel.create(payload);
        } else {
            await SettingModel.findByIdAndUpdate(data._id, payload);
        }
    }
}