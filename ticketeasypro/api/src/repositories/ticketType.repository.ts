import prisma from "./prisma";
import { Prisma, Role } from "@prisma/client";
import { BaseTypeTicket } from "@interfaces/tycketType.interface";
import { PaginatedTicketTypeResult, PartialTypeTicket, TypeTicketCreate } from "types/ticketType.type";
import { PaginationParams } from "@interfaces/common.interface";
import { paginate } from "@utils/paginate";
import { PaginateParams } from "types/common.type";



class TicketTypeRepository {
    private ticketTypeDb: Prisma.TicketTypeDelegate;
    constructor() {
        this.ticketTypeDb = prisma.ticketType;
    }

    create = async (typeTicketCreate: TypeTicketCreate): Promise<BaseTypeTicket> => {
        const typeTicket: BaseTypeTicket = await this.ticketTypeDb.create({ data: typeTicketCreate });
        return typeTicket;
    }

    findTicketTypes = async (
        query: string, paginationParams: PaginationParams, orderBy: Prisma.TicketTypeOrderByWithRelationInput[]
    ): Promise<PaginatedTicketTypeResult> => {
        let whereClause: Prisma.TicketTypeWhereInput = {}//{ AND: { initial_date: { gte: startDate }, final_date: { lte: endDate } } };

        // console.log({ query, startDate, endDate, category_id, status });

        if (query) {
            whereClause = ({
                ...whereClause,
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            });
        };
        const select = { id: true, name: true, discount: true, description: true };

        // Parâmetros de paginação incluindo orderBy
        const paginateParams: PaginateParams<Prisma.TicketTypeDelegate, Prisma.TicketTypeWhereInput, Prisma.TicketTypeOrderByWithRelationInput[]> = {
            model: this.ticketTypeDb,
            where: whereClause,
            paginationParams,
            select,
            orderBy
        };

        const paginated = await paginate<BaseTypeTicket, Prisma.TicketTypeWhereInput, Prisma.OrderByWithRelationInput[], typeof this.ticketTypeDb>(paginateParams);
        return paginated;
    };

    delete = async (ticketTypeId: number): Promise<BaseTypeTicket | null> => {

        // Iniciar uma transação
        const result = await prisma.$transaction(async (prisma) => {
            // Verificar se o TypeTicket existe
            const typeTicket = await this.ticketTypeDb.findUnique({
                where: { id: ticketTypeId }
            });

            // Se o TypeTicket não existir, lançar um erro
            if (!typeTicket) {
                throw new Error(`TypeTicket id: ${ticketTypeId} not found.`);
            }

            // Contar o número de OrderTicket que referenciam o TypeTicket
            const orderTicketCount = await prisma.orderTicket.count({
                where: { type_id: ticketTypeId }
            });

            // Se houver OrderTickets relacionados, lançar um erro
            if (orderTicketCount > 0) {
                return null
                console.log('Cannot delete TypeTicket as it has related OrderTickets.');
                //throw new Error('Cannot delete TypeTicket as it has related OrderTickets.');
            }

            // Se não houver OrderTickets relacionados, excluir o TypeTicket
            const deletedTypeTicket = await this.ticketTypeDb.delete({
                where: { id: ticketTypeId }
            });

            return deletedTypeTicket;
        });

        return result;

    };
    findDetails = async (ticketTypeId: number): Promise<BaseTypeTicket | null> => {
        // Verificar se o TypeTicket existe
        const typeTicket = await this.ticketTypeDb.findUnique({ where: { id: ticketTypeId } });
        return typeTicket
    }

    // toggleActive = async (identifier: Identifier, activeStatus?: boolean): Promise<boolean> => {
    //     const whereClause = buildWhereClause(identifier)

    //     try {
    //         let accountUpdated = null;
    //         if (!!activeStatus) {// apenas inverte o estado
    //             const account: Account = await this.findDetails(whereClause);
    //             accountUpdated = await this.userDb.update({
    //                 where: { id: account.id },
    //                 data: { active: account.active ?? !account.active }
    //             });

    //         } else {
    //             accountUpdated = await this.userDb.update({
    //                 where: whereClause,
    //                 data: { active: activeStatus }
    //             });
    //         }
    //         return !!accountUpdated;
    //     } catch (error) {
    //         throw new Error(`Failed to change status active for account: ${whereClause}\nError: ${error}`);
    //     }
    // };


    // update = async (identifier: Identifier, data: AccountUpdate): Promise<AccountResult> => {

    //     const whereClause = buildWhereClause(identifier)
    //     const filteredData = filterNullsData(data);

    //     const accountUpdated = await this.userDb.update(
    //         {
    //             where: whereClause,
    //             data: filteredData,
    //             select: {
    //                 id: true, email: true, name: true, email_confirmed: true, birth_date: true, phone: true,
    //                 phone_fix: true, role: true, active: true
    //             }
    //         }
    //     );
    //     return accountUpdated;
    // }
    // findAccounts = async (query: string, role?: Role, page: number = 1, pageSize: number = 10, orderBy: AccountSortParams = { name: 'asc' }): Promise<PaginatedAccountResult> => {

    //     let whereClause: Prisma.UserWhereInput = {};
    //     if (query || role) {
    //         whereClause = {
    //             ...(query && {
    //                 OR: [
    //                     { email: { contains: query, mode: 'insensitive' } },
    //                     { name: { contains: query, mode: 'insensitive' } },
    //                     { phone: { contains: query, mode: 'insensitive' } }
    //                 ]
    //             }),
    //             ...role && { role: { equals: role } }
    //         };
    //     }

    //     // Equivale a Select (id, email, name, email_confirmed ..) from USERS
    //     const select = {
    //         id: true, email: true, name: true, email_confirmed: true,
    //         birth_date: true, phone: true, phone_fix: true, role: true, active: true
    //     };

    //     // Parâmetros de paginação incluindo orderBy
    //     const paginateParams: PaginateParams<Prisma.UserDelegate, Prisma.UserWhereInput, Prisma.UserOrderByWithRelationInput> = {
    //         model: this.userDb,
    //         where: whereClause,
    //         paginationParams: { page, pageSize },
    //         select,
    //         orderBy
    //     };

    //     // const paginated = await paginate<AccountResult, Prisma.UserWhereInput, typeof this.userDb>(paginateParams);
    //     const paginated = await paginate<AccountResult, Prisma.UserWhereInput, AccountSortParams, typeof this.userDb>(paginateParams);


    //     return paginated;


    // }
}
export default TicketTypeRepository;