
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"
import EventService from "./../../services/event.service";
import { PaginatedEventResult, QueryPaginationFilterOrder } from "types/event.type";
import { BaseEvent, ControllerEventCreate, EventUpdate } from "@interfaces/event.interface";
import { Prisma, Role, EventStatus } from "@prisma/client";
import { PaginationParams, QueryIntervalDate } from "@interfaces/common.interface";

const mappingCriteria: Record<string, string> = {
    "price": "base_price",
    "date": "initial_date",
    "name": "name"
}
const mappingStatus: Record<string, EventStatus> = {
    "planned": EventStatus.PLANNED,
    "in-progress": EventStatus.IN_PROGRESS,
    "completed": EventStatus.COMPLETED,
    "cancelled": EventStatus.CANCELLED,
}

const defaultOrderCriteria: Prisma.EventOrderByWithRelationInput[] = [
    { name: "asc" }, { initial_date: "desc" }, { final_date: "asc" }, { base_price: "desc" }
];

const EventRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
    const eventService: EventService = new EventService();

    api.get<{ Querystring: QueryPaginationFilterOrder }>('/',
        async (
            request: FastifyRequest<{ Querystring: QueryPaginationFilterOrder }>, reply: FastifyReply
        ): Promise<PaginatedEventResult> => {
            const {
                filter, page = 1, "page-size": pageSize = 10, "start-date": tsStartDate,
                "end-date": tsEndDate, "category-id": categoryId, "order-by": orderBy = "price:asc,date:asc,name:desc",
                status = "planned"
            } = request.query;
            let orderCriteria: Prisma.EventOrderByWithRelationInput[] = [...defaultOrderCriteria];

            if (orderBy) {
                orderCriteria = orderBy.split(',').map(criterion => {
                    const [field, direction] = criterion.split(':');
                    const mappedField = mappingCriteria[field] || field; // Se houver um mapeamento, use o nome mapeado, caso contrário, use o original
                    return { [mappedField]: direction } as Prisma.EventOrderByWithRelationInput;
                });
            };

            const paginationParams: PaginationParams = { page, pageSize };
            const queryIntervalDate: QueryIntervalDate = { tsStartDate, tsEndDate };

            const eventStatus = mappingStatus[status];

            const allFilterOrdenedEvents = await eventService.searchEvents(
                filter, paginationParams, queryIntervalDate, orderCriteria, eventStatus, categoryId
            );

            return reply.code(200).send(allFilterOrdenedEvents);
        });

    api.post('/',
        { preHandler: [api.authenticate, api.authorizeRoles([Role.EVENT_MANAGER,])] },
        async (request: FastifyRequest<{ Body: ControllerEventCreate }>, reply: FastifyReply): Promise<BaseEvent> => {
            const { user: { sub: actorId }, body } = request;

            const eventCreated = await eventService.create(actorId, body);

            return reply.code(201).send(eventCreated);

        });

    api.put('/:eventId/updateAttribute',
        { preHandler: [api.authenticate, api.authorizeRoles([Role.EVENT_MANAGER,])] },
        async (request: FastifyRequest<{
            Params: { eventId: number, updateAttribute?: string }, Body: EventUpdate
        }>, reply: FastifyReply): Promise<BaseEvent> => {

            const { body: eventUpdate, params: { eventId, updateAttribute } } = request;
            const allowedFields = ['status', 'manager-id', 'category-id', 'location-id'];
            if (updateAttribute && !allowedFields.includes(updateAttribute)) {
                return reply.code(400).send({ message: 'Invalid Field to Update.' });
            }


            const eventCreated = await eventService.update(eventId, eventUpdate);

            return reply.code(201).send(eventCreated);

        })

}
export default EventRoute;

