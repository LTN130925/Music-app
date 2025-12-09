import session from "express-session";
import prefixNameConfig from "./prefixName.config";

export const adminSession = session({
    secret: process.env.SESSION_SECRET_SERVER,
    name: "admin.sid",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7, path: prefixNameConfig.PATH_ADMIN}
});
