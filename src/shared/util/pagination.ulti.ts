export const pagination = (objectPagination: any, total: number, query: any) => {
    if (query.page) objectPagination.currentPage = query.page;
    if (query.limit) objectPagination.limit = query.limit;
    objectPagination.totalPages = Math.ceil(total / objectPagination.limit);
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limit;
    return objectPagination;
}