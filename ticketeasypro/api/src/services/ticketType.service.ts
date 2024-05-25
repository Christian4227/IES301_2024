
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
    };


    //     const filteredDataUpdate = this.filterNullsData(dataUpdate);
    //     eventId = Number(eventId);
    //     const eventStored: EventUniqueResult = await this.eventRepository.findDetails(eventId);
    //     const { ts_initial_date, ts_final_date, location_id, manager_id, category_id, ...rest } = filteredDataUpdate;
    //     let { status } = filteredDataUpdate
    //     const toBeUpdatedIntervalDates = resolveDates(eventStored, { ts_initial_date, ts_final_date });

    //     const { ts_initial_date: initial_date, ts_final_date: final_date } = toBeUpdatedIntervalDates
    //     const toUpdateData: any = rest;

    //     if (status && !Object.values(EventStatus).includes(status))
    //         throw new Error("Event status is invalid.");

    //     if (initial_date) toUpdateData.initial_date = new Date(initial_date);
    //     if (final_date) toUpdateData.final_date = new Date(final_date);
    //     if (manager_id) toUpdateData.event_manager = { connect: { id: manager_id } };
    //     if (category_id) toUpdateData.category = { connect: { id: category_id } };
    //     if (location_id) toUpdateData.location = { connect: { id: location_id } };

    //     const updatedEvent = await this.eventRepository.update(eventId, toUpdateData);


    //     return {
    //         ...updatedEvent, ts_initial_date: updatedEvent.initial_date.getTime(), ts_final_date: updatedEvent.final_date.getTime()
    //     };
    // };

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