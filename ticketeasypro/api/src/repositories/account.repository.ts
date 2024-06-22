import prisma from "./prisma";
import { AccountUpdate, Account, AccountResult, AccountCreate, AccountCreateResult, AccountSortParams } from "@interfaces/repository/account.interface";
import { Identifier, PaginateParams } from "types/common.type";
import { filterNullsData, buildWhereClause } from "@utils/mixes";
import { Prisma, Role } from "@prisma/client";
import { paginate } from "@utils/paginate";
import { PaginatedAccountResult } from "@interfaces/service/account.interface";


class AccountRepository {
    private userDb: Prisma.UserDelegate;
    constructor() {
        this.userDb = prisma.user;
    }

    create = async ({ email, name, birth_date, phone, role, salt, phone_fix, password }: AccountCreate): Promise<AccountCreateResult> => {
        let account = await this.userDb.create({ data: { email, name, birth_date, role, salt, phone, phone_fix, password } });
        return account;
    }

    find = async (identifier: Identifier): Promise<AccountResult | null> => {
        const whereClause = buildWhereClause(identifier)

        const account = await this.userDb.findUnique({
            where: whereClause,
            select: {
                id: true, email: true, name: true, email_confirmed: true,
                birth_date: true, phone: true, phone_fix: true, role: true, active: true
            }
        });
        return account
    }

    findDetails = async (identifier: Identifier): Promise<Account> => {
        // Constrói o objeto 'where' de forma dinâmica baseado no input fornecido
        const whereClause = buildWhereClause(identifier)

        const user = await this.userDb.findUnique({
            where: whereClause
        });

        if (!user) throw new Error(`User ${whereClause.email ?? whereClause.id} not found`);

        return user;
    }

    findWhere = async (where: Prisma.UserWhereUniqueInput): Promise<Account> => {
        // Constrói o objeto 'where' de forma dinâmica baseado no input fornecido
        const whereClause = buildWhereClause(where)

        const user = await this.userDb.findUnique({
            where: whereClause
        });

        if (!user) throw new Error(`User ${whereClause.email ?? whereClause.id} not found`);
        return user;
    }

    toggleActive = async (identifier: Identifier, activeStatus?: boolean): Promise<boolean> => {
        const whereClause = buildWhereClause(identifier)

        try {
            let accountUpdated = null;
            if (!!activeStatus) {// apenas inverte o estado
                const account: Account = await this.findDetails(whereClause);
                accountUpdated = await this.userDb.update({
                    where: { id: account.id },
                    data: { active: account.active ?? !account.active }
                });

            } else {
                accountUpdated = await this.userDb.update({
                    where: whereClause,
                    data: { active: activeStatus }
                });
            }
            return !!accountUpdated;
        } catch (error) {
            throw new Error(`Failed to change status active for account: ${whereClause}\nError: ${error}`);
        }
    };

    update = async (identifier: Identifier, data: AccountUpdate): Promise<AccountResult> => {
        const whereClause = buildWhereClause(identifier);
        const filteredData = filterNullsData(data);

        const accountUpdated = await this.userDb.update({
            where: whereClause, data: filteredData
        });

        return accountUpdated;
    }
    findAccounts = async (query: string, role?: Role, page: number = 1, pageSize: number = 10, orderBy: AccountSortParams = { name: 'asc' }): Promise<PaginatedAccountResult> => {

        let whereClause: Prisma.UserWhereInput = {};
        if (query || role) {
            whereClause = {
                ...(query && {
                    OR: [
                        { email: { contains: query, mode: 'insensitive' } },
                        { name: { contains: query, mode: 'insensitive' } },
                        { phone: { contains: query, mode: 'insensitive' } }
                    ]
                }),
                ...role && { role: { equals: role } }
            };
        }

        // Equivale a Select (id, email, name, email_confirmed ..) from USERS
        const select = {
            id: true, email: true, name: true, email_confirmed: true,
            birth_date: true, phone: true, phone_fix: true, role: true, active: true
        };

        // Parâmetros de paginação incluindo orderBy
        const paginateParams: PaginateParams<Prisma.UserDelegate, Prisma.UserWhereInput, Prisma.UserOrderByWithRelationInput> = {
            model: this.userDb,
            where: whereClause,
            paginationParams: { page, pageSize },
            select,
            orderBy
        };

        // const paginated = await paginate<AccountResult, Prisma.UserWhereInput, typeof this.userDb>(paginateParams);
        const paginated = await paginate<AccountResult, Prisma.UserWhereInput, AccountSortParams, typeof this.userDb>(paginateParams);


        return paginated;


    }
}
export default AccountRepository;