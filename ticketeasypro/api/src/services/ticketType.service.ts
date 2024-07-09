
import { Prisma } from "@prisma/client";
import { PaginatedTicketTypeResult, PartialTypeTicket, TypeTicketCreate } from "types/ticketType.type";
import { BaseTypeTicket } from "./../interfaces/tycketType.interface";
import TicketTypeRepository from "./../repositories/ticketType.repository";
import { PaginationParams } from "@interfaces/common.interface";
import { integerRegex } from "@utils/validators";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";



class TicketTypeService {
    private ticketTypeRepository: TicketTypeRepository;
    constructor() {
        this.ticketTypeRepository = new TicketTypeRepository();
    }
    create = async (ticketTypeCreate: TypeTicketCreate): Promise<BaseTypeTicket> => {
        try {
            const eventCreated = await this.ticketTypeRepository.create(ticketTypeCreate);
            const { id, name, discount, description } = eventCreated;
            return { id, name, discount, description } as BaseTypeTicket;
        } catch (error) {
            console.error("Error in TicketTypeService.modify:", error); // Adicione logs para depuração
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                const meta = error.meta as { target?: string[] }; // Adiciona um tipo explícito para meta
                const targetField = meta?.target?.join(', ') || 'unknown field';
                throw new Error(`Field(s): ${targetField} on TicketType must be unique.`);
            }
            throw error; // Lance novamente o erro original se for um tipo inesperado
        }

    }

    filterNullsData = (data: Partial<BaseTypeTicket>): Partial<BaseTypeTicket> => {
        return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== null && value !== undefined));
    };

    async modify(ticketTypeId: number, dataUpdate: PartialTypeTicket): Promise<BaseTypeTicket> {
        try {
            return await this.ticketTypeRepository.update(ticketTypeId, dataUpdate);
        } catch (error) {
            console.error("Error in TicketTypeService.modify:", error); // Adicione logs para depuração
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                const meta = error.meta as { target?: string[] }; // Adiciona um tipo explícito para meta
                const targetField = meta?.target?.join(', ') || 'unknown field';
                throw new Error(`Field(s): "${targetField}" on TicketType must be unique.`);
            }
            throw error; // Lance novamente o erro original se for um tipo inesperado
        }
    }

    getTicketTypes = async (eventId: number): Promise<BaseTypeTicket> => {
        const typeTicket = await this.ticketTypeRepository.findDetails(eventId)
        if (!typeTicket)
            throw new Error(`TicketType id: ${eventId} not found.`);
        return typeTicket;

    };

    searchTicketTypes = async (query: string,
        paginationParams: PaginationParams,
        orderBy: Prisma.TicketTypeOrderByWithRelationInput[] = [{ name: "asc" }, { description: "asc" }, { discount: "desc" }]
    ): Promise<PaginatedTicketTypeResult> => {
        let { page, pageSize } = paginationParams;

        if (!(integerRegex.test(page.toString()) && integerRegex.test(page.toString())))
            throw new Error('Page and PageSize must be valid integer value.');

        paginationParams.page = Number(page);
        paginationParams.pageSize = Number(pageSize);

        if (page <= 0) throw new Error("The page is min equals 1.");
        if (pageSize > 200) throw new Error("The page-size is to largest.");

        const paginatedTicketTypeResult: PaginatedTicketTypeResult = await this.ticketTypeRepository.findTicketTypes(query, paginationParams, orderBy);
        return paginatedTicketTypeResult;
    }
}
export default TicketTypeService;