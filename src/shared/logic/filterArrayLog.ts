export class logicFilterArrayLog {
    private ArrayBlog: any[];

    public setArray(object): void {
        this.ArrayBlog = object;
    }

    public filterArrayLog(): any[]  {
        const res: any[] = [];
        for (const song of this.ArrayBlog) {
            if (!song.updatedBlogId) continue;

            const blogs = song.updatedBlogId['list_blog'];
            blogs.forEach(blog => {
                res.push(blog);
            })
        }
        return res;
    }
}