import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { UserModel } from "../model/user.model";
import { ManagerModel } from "../model/manager.model";

passport.use(
    "local-client",
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({email, deleted: false}).exec();
                if (!user) return done(null, false, {message: 'Tài khoản hoặc mật khẩu không đúng!'});
                if (user.status === 'inactive') return done(null, false, {message: 'Tài khoản đã bị khóa!'});
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return done(null, false, {message: 'Tài khoản hoặc mật khẩu không đúng!'});
                delete user.password;
                return done(null, { id: user._id, type: "client" });
            } catch (e) {
                return done(e);
            }
        }
    )
);

passport.use(
    "local-server",
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const manager = await ManagerModel.findOne({email, deleted: false}).exec();
                if (!manager) return done(null, false, {message: 'Tài khoản không tồn tại!'});
                if (manager.status === 'inactive') return done(null, false, {message: 'Tài khoản đã bị khóa!'});
                const isMatch = await bcrypt.compare(password, manager.password);
                if (!isMatch) return done(null, false, {message: 'Tài khoản hoặc mật khẩu không đúng!'});
                delete manager.password;
                return done(null, { id: manager._id, type: "admin" });
            } catch (e) {
                return done(e);
            }
        }
    )
);


passport.serializeUser((user, done) => {
    done(null, user); // user = { id, type }
});

passport.deserializeUser(async (data: any, done) => {
    try {
        if (data.type === "client") {
            const user = await UserModel.findById(data.id)
                .populate('listLikesSong', 'listId')
                .populate('listFavoritesSong', 'listId')
                .populate('listViewsSong', 'listId')
                .populate('subscribers', 'listId')
                .populate('messageId')
                .select('-password')
                .exec();
            return done(null, user);
        }

        if (data.type === "admin") {
            const manager = await ManagerModel.findById(data.id).select("-password")
                .populate('createdBy.managerId', 'fullName')
                .populate({path: 'updatedBlogId', populate: {path: 'list_blog.managerId', select: 'fullName'}})
                .populate({path: 'roleId', populate: {path: 'permissions', select: 'listPermission'}})
                .select('-password')
                .exec();
            return done(null, manager);
        }

        return done(null, false);
    } catch (e) {
        return done(e);
    }
});

export default passport;
