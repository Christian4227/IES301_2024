import prisma from "./../repositories/prisma";
import { PaginateParams, PrismaDelegate } from "types/common.type";
import { PaginatedResult } from "@interfaces/common.interface";

export async function paginate<T, TWhereInput, TOrderBy, TDelegate extends PrismaDelegate>(
    { model, where, select, orderBy, paginationParams }: PaginateParams<TDelegate, TWhereInput, TOrderBy>
): Promise<PaginatedResult<T>> {

    const { page, pageSize } = paginationParams;

    const skip = (page - 1) * pageSize;
    const [total, data] = await prisma.$transaction(async () => {
        const totalCount = await model.count({ where });
        const dataList = await model.findMany({
            where,
            select,
            orderBy,
            skip,
            take: pageSize,
        });
        return Promise.all([totalCount, dataList]);
    });
    const totalPages = Math.ceil(total / pageSize);

    return { data, total, totalPages, currentPage: page, pageSize };
}

interface MappingOrderCriteria {
    [key: string]: string;
}

export const parseOrderBy = <T>(orderBy: string, mappingOrderCriteria: MappingOrderCriteria): { [P in keyof T]?: 'asc' | 'desc' }[] => {
    return orderBy.split(',').map(criterion => {
        const [field, direction] = criterion.split(':');
        const mappedField = mappingOrderCriteria[field] || field;
        return { [mappedField]: direction as 'asc' | 'desc' } as { [P in keyof T]?: 'asc' | 'desc' };
    });
};

// export const parseOrderBy = <T>(orderBy: string, mappingOrderCriteria: Record<string, keyof T>): { [P in keyof T]?: 'asc' | 'desc' }[] => {
//     return orderBy.split(',').map(criterion => {
//         const [field, direction] = criterion.split(':');
//         const mappedField = mappingOrderCriteria[field] || field;
//         return { [mappedField]: direction } as { [P in keyof T]?: 'asc' | 'desc' };
//     });
// };