import session from "express-session";

export const clientSession = session({
    secret: process.env.SESSION_SECRET_CLIENT,
    name: "client.sid",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7, path: '/'}
});
