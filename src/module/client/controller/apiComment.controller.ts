import {Request, Response} from 'express';

import {commentService} from '../service/apiComment.service';
const serviceInstance = new commentService();

export class controller {
    async getListComments(req: Request, res: Response) {
        const {id} = req.params;
        const data = await serviceInstance.getListComments(id, req.user['_id']);
        res.status(200).json(data);
    }

    async commentPost(req: Request, res: Response) {
        try {
            const songId = req.params.id;
            const userId = req.user['_id'];
            const { content, parentId } = req.body;

            const newComment = await serviceInstance.addComment(songId, userId, content, parentId);
            res.status(201).json(newComment);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async reactPost(req: Request, res: Response) {
        const {id} = req.params;
        const {type} = req.body;
        await serviceInstance.react(id, type, req.user['_id']);
        res.status(200).json({ success: true });
    }
}