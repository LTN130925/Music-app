import { Schema, model, Document } from "mongoose";

export interface ISetting extends Document {
    siteName: string;
    contactEmail: string;
    phone: string;
    logo?: string;
    copyright: string;
    maintenance: boolean;
}


const SettingSchema = new Schema<ISetting>(
    {
        siteName: {
            type: String,
            default: ""
        },

        contactEmail: {
            type: String,
            default: ""
        },

        phone: {
            type: String,
            default: ""
        },

        logo: {
            type: String,
            default: ""
        },

        copyright: {
            type: String,
            default: ""
        },

        maintenance: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const SettingModel = model<ISetting>("Setting", SettingSchema, "general-setting");
