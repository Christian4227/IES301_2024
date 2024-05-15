import { PaginationParams } from "@interfaces/common.interface";

export type Identifier = {
    id?: string;
    email?: string;
}

export type PaginateParams<TDelegate, TWhereInput, EventOrderByWithRelationInput> = {
    model: TDelegate;
    where: TWhereInput;
    select?: any;
    paginationParams: PaginationParams;
    orderBy: EventOrderByWithRelationInput;
};

export type PrismaDelegate = {
    count: (args?: { where?: any }) => Promise<number>;
    findMany: (args?: { where?: any; skip?: number; take?: number; select?: any, orderBy: any }) => Promise<any[]>;
};