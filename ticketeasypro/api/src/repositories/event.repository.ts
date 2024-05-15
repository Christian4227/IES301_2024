import { PaginationParams } from "@interfaces/common.interface";
import prisma from "./prisma";
import { EventCreate, EventCreateResult, EventResult, Event, EventUpdate, BaseEvent, RepoEventCreate } from "@interfaces/event.interface";
import { EventStatus, Prisma, Role } from "@prisma/client";
import { paginate } from "@utils/paginate";
import { filterNullsData } from "@utils/mixes";
import { PaginateParams } from "types/common.type";
import { PaginatedEventResult } from "types/event.type";


class EventRepository {
    private eventDb: Prisma.EventDelegate;
    constructor() {
        this.eventDb = prisma.event;
    }

    create = async (eventCreate: RepoEventCreate): Promise<BaseEvent> => {
        const { category_id, manager_id, location_id, ...rest } = eventCreate;

        const event = await this.eventDb.create({
            data: {
                ...rest, category: {
                    connect: { id: category_id }
                }, event_manager: {
                    connect: { id: manager_id }
                }, location: {
                    connect: { id: location_id }
                }
            }
        });
        return event;
    };

    find = async (identifier: number): Promise<BaseEvent> => {
        const event = await this.eventDb.findUnique({
            where: { id: identifier },
            select: {
                id: true, name: true, description: true, initial_date: true, final_date: true, status: true,
                base_price: true, capacity: true, img_banner: true, img_thumbnail: true, color: true, category_id: true,
                manager_id: true, location_id: true
            }
        });
        if (!event) throw new Error(`Event id: ${identifier} not found.`);
        return event
    };
    findDetails = async (identifier: number): Promise<BaseEvent> => {
        const whereClause = { id: identifier };

        const event = await this.eventDb.findUnique({
            where: whereClause,
            select: {
                id: true,
                name: true, description: true, initial_date: true, final_date: true, status: true,
                base_price: true, capacity: true, img_banner: true, img_thumbnail: true, color: true,
                category_id: true, event_manager: true, location: true, location_id: true,
                manager_id: true, Ticket: true
            }
        });

        if (!event) throw new Error(`Event id: ${identifier} not found.`);
        return event;
    };

    update = async (identifier: number, data: EventUpdate): Promise<BaseEvent> => {
        const whereClause = { id: identifier };
        const filteredData = filterNullsData(data);

        const eventUpdated = await this.eventDb.update({
            where: whereClause,
            data: filteredData
        });
        return eventUpdated;

    }
    findEvents = async (
        query: string,
        paginationParams: PaginationParams,
        orderBy: Prisma.EventOrderByWithRelationInput[],
        startDate: Date,
        endDate: Date,
        status?: EventStatus,
        category_id?: number

    ): Promise<PaginatedEventResult> => {

        let whereClause: Prisma.EventWhereInput = {};

        whereClause = {
            ...(query && {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            }), AND: { initial_date: { gte: startDate } }
        };
        if (category_id) whereClause.category_id = { equals: category_id };
        if (status) whereClause.status = { equals: status };

        if (endDate) whereClause.final_date = { lte: endDate }
        const select = {
            id: true, name: true, description: true, initial_date: true, final_date: true, status: true,
            base_price: true, capacity: true, img_banner: true, img_thumbnail: true, color: true, category_id: true,
            manager_id: true, location_id: true
        };
        // Parâmetros de paginação incluindo orderBy
        const paginateParams: PaginateParams<Prisma.EventDelegate, Prisma.EventWhereInput, Prisma.EventOrderByWithRelationInput[]> = {
            model: this.eventDb,
            where: whereClause,
            paginationParams,
            select,
            orderBy
        };

        const paginated = await paginate<EventResult, Prisma.EventWhereInput, Prisma.EventOrderByWithRelationInput[], typeof this.eventDb>(paginateParams);
        return paginated;
    }
}
export default EventRepository;