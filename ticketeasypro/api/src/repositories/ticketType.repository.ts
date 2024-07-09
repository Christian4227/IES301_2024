import prisma from "./prisma";
import { Prisma } from "@prisma/client";
import { BaseTypeTicket } from "@interfaces/tycketType.interface";
import { PaginatedTicketTypeResult, PartialTypeTicket, TypeTicketCreate } from "types/ticketType.type";
import { PaginationParams } from "@interfaces/common.interface";
import { paginate } from "@utils/paginate";
import { PaginateParams } from "types/common.type";
import { filterNullsData } from "@utils/mixes";



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
        }
        const select = { id: true, name: true, discount: true, description: true };

        // Parâmetros de paginação incluindo orderBy
        const paginateParams: PaginateParams<Prisma.TicketTypeDelegate, Prisma.TicketTypeWhereInput, Prisma.TicketTypeOrderByWithRelationInput[]> = {
            model: this.ticketTypeDb,
            where: whereClause,
            paginationParams,
            select,
            orderBy
        };

        const paginated = await paginate<BaseTypeTicket, Prisma.TicketTypeWhereInput, Prisma.TicketTypeOrderByWithRelationInput[], typeof this.ticketTypeDb>(paginateParams);
        return paginated;
    };

    delete = async (ticketTypeId: number): Promise<BaseTypeTicket | null> => {

        // Iniciar uma transação
        const result = await prisma.$transaction(async (transaction) => {
            // Verificar se o TypeTicket existe
            const typeTicket = await this.ticketTypeDb.findUnique({ where: { id: ticketTypeId } });

            // Se o TypeTicket não existir, lançar um erro
            if (!typeTicket) {
                throw new Error(`TypeTicket id: ${ticketTypeId} not found.`);
            }

            // Contar o número de OrderTicket que referenciam o TypeTicket
            const orderTicketCount = await transaction.orderTicket.count({
                where: { id: ticketTypeId }
            });

            // Se houver OrderTickets relacionados, lançar um erro
            if (orderTicketCount > 0) {
                // return null
                // console.log('Cannot delete TypeTicket as it has related OrderTickets.');
                throw new Error('Cannot delete TypeTicket as it has related OrderTickets.');
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


    async update(eventId: number, data: PartialTypeTicket): Promise<BaseTypeTicket> {
        const filteredData = filterNullsData(data); // Certifique-se que filterNullsData esteja definida e funcionando corretamente
        try {
            const accountUpdated = await this.ticketTypeDb.update({
                where: { id: eventId },
                data: filteredData
            });
            return accountUpdated;
        } catch (error) {
            console.error("Error in TicketTypeRepository.update:", error); // Adicione logs para depuração
            throw error; // Re-lance o erro para ser capturado no nível superior
        }
    }
}
export default TicketTypeRepository;