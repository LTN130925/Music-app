import {Application} from "express";

// route
import topicRoute from './topic.route';
import songRoute from './song.route';
import apiCommentRoute from './api.route';
import userRoute from './auth.route';
import singerRoute from './singer.route';
import profileRoute from './profile.route';
import notification from './notification.route';
import playlistRoute from './playlist.route';
import feedRoute from './feed.route';
import homeRoute from './home.route';
import verificationRoute from './verification.route';

// middleware
import {isAuthenticated} from '../../../common/middleware/auth.middleware'

export default (app: Application) => {
    app.get('/', (req, res) => {
        res.redirect('/home');     // hoặc render trang chính
    });

    app.use('/home', isAuthenticated, homeRoute);

    app.use('/topic', isAuthenticated, topicRoute);

    app.use('/song', isAuthenticated, songRoute);

    app.use('/api', isAuthenticated, apiCommentRoute);

    app.use('/singer', isAuthenticated, singerRoute);

    app.use('/profile', isAuthenticated, profileRoute);

    app.use('/notification', isAuthenticated, notification);

    app.use('/playlist', isAuthenticated, playlistRoute);

    app.use('/feed', isAuthenticated, feedRoute);

    app.use('/verification', isAuthenticated, verificationRoute);

    app.use('/auth', userRoute);
}