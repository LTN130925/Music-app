import {Types} from "mongoose";

import {IComment} from "../../common/model/comment.model";
import { CommentResponse } from "../../common/model/comment.model";

export class getChildAndParentComments {
    private listComments: IComment[];
    private hashTable: Record<string, CommentResponse>;
    private comments: CommentResponse[];
    private userId: Types.ObjectId;
    private pending: Record<string, CommentResponse[]>;

    constructor(comments?: IComment[], userId?: Types.ObjectId) {
        this.listComments = comments || [];
        this.hashTable = {};
        this.comments = [];
        this.userId = userId;
        this.pending = {};
        this.buildTree();
    }

    public getComments(): CommentResponse[] {
        return this.comments;
    }

    private buildTree(): CommentResponse[] {
        for (const c of this.listComments) {
            const id = c._id.toString();

            const node: CommentResponse = {
                id,
                author: c.user_id?.['fullName'] || 'Không tồn tại!',
                content: c.content,
                createdAt: c.createdAt,
                likesCount: c.likesCount,
                dislikesCount: c.dislikesCount,
                isLiked: c.likes.some((x: any) => x.equals(this.userId)),
                isDisliked: c.dislikes.some((x: any) => x.equals(this.userId)),
                replies: [],
            };

            this.hashTable[id] = node;

            if (this.pending[id]) {
                for (const child of this.pending[id]) {
                    child.replyTo = node.author;
                    node.replies.push(child);
                }
                delete this.pending[id];
            }

            if (c.parent_id) {
                const parentId = c.parent_id.toString();

                if (this.hashTable[parentId]) {
                    node.replyTo = this.hashTable[parentId].author;
                    this.hashTable[parentId].replies.push(node);
                } else {
                    if (!this.pending[parentId]) {
                        this.pending[parentId] = [];
                    }
                    this.pending[parentId].push(node);
                }
            } else {
                this.comments.push(node);
            }
        }

        return this.comments;
    }
}