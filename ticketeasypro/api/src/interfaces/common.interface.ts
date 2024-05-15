export interface PaginatedResult<T> {
    data: T[];
    total: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

export interface PaginationParams {
    page: number;
    pageSize: number;
}

export interface QueryPaginationFilter {
    paginationParams: PaginationParams;
    filter: string;
}
export interface QueryIntervalDate {
    tsStartDate: number,
    tsEndDate?: number
}