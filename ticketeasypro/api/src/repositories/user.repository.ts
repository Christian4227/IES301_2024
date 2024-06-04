
import prisma from "./prisma";
import { PaginatedUserResult } from "../types/repository/user.type"
import { paginate } from "../utils/paginate";
import { User, UserCreate, UserResult, UserSortParams, UserUpdate } from "../interfaces/repository/user.interface";
import { Prisma, Role } from "@prisma/client";
import { Identifier, PaginateParams } from "../types/common.type";
import { buildWhereClause, filterNullsData } from "../utils/mixes";
import { PaginationParams } from "@interfaces/common.interface";


class UserRepository {
    private userDb: Prisma.UserDelegate;

    constructor() {
        this.userDb = prisma.user;
    }

    create = async (userCreate: UserCreate): Promise<UserResult> => {
        const result = await this.userDb.create({ data: userCreate });
        return result;
    }

    find = async (indentifier: Identifier): Promise<UserResult | null> => {
        const whereClause = buildWhereClause(indentifier)
        // try {
        const user = await this.userDb.findUnique({
            where: whereClause, select: {
                id: true,
                email: true, password: true, email_confirmed: true, birth_date: true, name: true, phone: true, phone_fix: true,
                role: true, salt: true, active: true, created_at: true, updated_at: true
            }
        });
        return user;
    }


    deleteOne = async (indentifier: Identifier): Promise<UserResult> => {
        const whereClause = buildWhereClause(indentifier);
        try {
            const deletedUser = await this.userDb.delete({
                where: whereClause
            });
            return deletedUser;
        } catch (error) {
            throw new Error(`Failed to delete user: ${error}`);
        }
    };

    update = async (indentifier: Identifier, userUpdateDatata: UserUpdate): Promise<UserResult> => {
        const whereClause = buildWhereClause(indentifier);
        const filteredData = filterNullsData(userUpdateDatata);

        const userUpdated = await this.userDb.update({
            where: whereClause,
            data: filteredData
        }

        );
        return userUpdated;
    }
    findUsers = async (query: string, page: number = 1, pageSize: number = 10, orderBy: UserSortParams = { name: 'asc' }): Promise<PaginatedUserResult> => {
        const whereClause: Prisma.UserWhereInput = {
            OR: [
                { email: { contains: query, mode: 'insensitive' } },
                { name: { contains: query, mode: 'insensitive' } },
                { phone: { contains: query, mode: 'insensitive' } }
            ]
        };
        // Equivale a Select (id, email, name, email_confirmed ..) from USERS
        const select = {
            id: true, email: true, name: true, email_confirmed: true,
            birth_date: true, phone: true, phone_fix: true, role: true, active: true
        };

        // Parâmetros de paginação 
        const paginateParams: PaginateParams<Prisma.UserDelegate, Prisma.UserWhereInput, Prisma.UserOrderByWithRelationInput> = {
            model: this.userDb,
            where: whereClause,
            paginationParams: { page, pageSize } as PaginationParams,
            select,
            orderBy
        };
        const paginated = await paginate<UserResult, Prisma.UserWhereInput, UserSortParams, typeof this.userDb>(paginateParams);

        return paginated;

    }

}


export default UserRepository;