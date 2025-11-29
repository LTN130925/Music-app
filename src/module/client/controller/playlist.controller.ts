import {Request, Response} from 'express';

import {playlistLikeService} from '../service/playlist.service';
const serviceInstance = new playlistLikeService();

export class controller {
    async index(req: Request, res: Response) {
        const songs = await serviceInstance.getListSong(req.user);
        res.render('client/pages/songs/list', {
            titlePage: 'Danh sách bài hát yêu thích',
            songs
        });
    }
}