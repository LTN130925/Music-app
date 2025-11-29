import {Request, Response} from 'express';

import {playlistService} from '../service/playlist.service';
import {IUser} from "../../../common/model/user.model";
const serviceInstance = new playlistService();

export class controller {
    async index(req: Request, res: Response) {
        const songs = await serviceInstance.getListSong(req.user);
        res.render('client/pages/songs/list', {
            titlePage: 'Danh sách bài hát yêu thích',
            songs
        });
    }

    async favourite(req: Request, res: Response) {
        const user = req.user as IUser;
        const songs = await serviceInstance.favourite(user);
        res.render('client/pages/favourite/favourite', {
            titlePage: 'Bài hát yêu thích',
            songs,
        })
    }
}