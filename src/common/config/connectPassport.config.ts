import {Application} from "express";

import passportConfig from "./passport.config";
import {adminSession} from "./session.server";
import {clientSession} from "./session.client";

import prefixNameConfig from "./prefixName.config";

export default (app: Application) => {
    app.use(prefixNameConfig.PATH_ADMIN, adminSession);
    app.use(clientSession);

    app.use(passportConfig.initialize());
    app.use(passportConfig.session());
}