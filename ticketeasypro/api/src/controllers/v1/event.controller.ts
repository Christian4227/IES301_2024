
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import EventService from "@services/event.service";
import { integerRegex } from "@utils/validators";
import { PaginatedEventResult, PartialEventUpdate, QueryPaginationFilterOrder } from "types/event.type";
import { BaseEvent, ControllerEventCreate, EventResult, EventUpdate } from "@interfaces/event.interface";
import { Prisma, Role, EventStatus } from "@prisma/client";
import { PaginationParams, QueryIntervalDate } from "@interfaces/common.interface";

const mappingFilterStatus: Record<string, EventStatus> = {
    "planned": EventStatus.PLANNED,
    "in-progress": EventStatus.IN_PROGRESS,
    "completed": EventStatus.COMPLETED,
    "cancelled": EventStatus.CANCELLED,
};

const mappingOrderCriteria: Record<string, string> = {
    "price": "base_price",
    "date": "initial_date",
    "name": "name"
};


const defaultConfig = {
    page: 1,
    pageSize: 10,
    orderBy: "price:asc,date:asc,name:desc",
    status: "planned",
    defaultOrderCriteria: [
        { name: "asc" }, { initial_date: "desc" }, { final_date: "asc" }, { base_price: "desc" }
    ] as Prisma.EventOrderByWithRelationInput[]
};


const parseOrderBy = (orderBy: string): Prisma.EventOrderByWithRelationInput[] => {
    return orderBy.split(',').map(criterion => {
        const [field, direction] = criterion.split(':');
        const mappedField = mappingOrderCriteria[field] || field;
        return { [mappedField]: direction } as Prisma.EventOrderByWithRelationInput;
    });
};

const EventRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
    const eventService: EventService = new EventService();

    api.get<{ Querystring: QueryPaginationFilterOrder }>(
        '/', async (request: FastifyRequest<{ Querystring: QueryPaginationFilterOrder }>, reply: FastifyReply): Promise<PaginatedEventResult> => {
            const {
                filter, page = defaultConfig.page, "page-size": pageSize = defaultConfig.pageSize, "start-date": tsStartDate, "end-date": tsEndDate,
                "category-id": categoryId, "order-by": orderBy = defaultConfig.orderBy, status = defaultConfig.status
            } = request.query;

            const orderCriteria = orderBy ? parseOrderBy(orderBy) : defaultConfig.defaultOrderCriteria;

            const paginationParams: PaginationParams = { page, pageSize };
            const queryIntervalDate: QueryIntervalDate = { tsStartDate, tsEndDate };

            const eventStatus = mappingFilterStatus[status];

            const allFilterOrdenedEvents = await eventService.searchEvents(filter, paginationParams, queryIntervalDate, orderCriteria, eventStatus, categoryId);

            return reply.code(200).send(allFilterOrdenedEvents);
        }
    );
    api.get('/:eventId', { preHandler: [api.authenticate, api.authorizeRoles([Role.EVENT_MANAGER,])] },
        async (request: FastifyRequest<{ Params: { eventId: number } }>, reply: FastifyReply): Promise<EventResult> => {
            const { body: eventUpdate, params: { eventId } } = request;
            if (!integerRegex.test(eventId.toString()))
                return reply.code(400).send({ message: 'eventId must be valid value.' });
            const eventFinded = await eventService.getEvent(Number(eventId));

            return reply.code(200).send(eventFinded);
        }
    );

    api.post('/',
        { preHandler: [api.authenticate, api.authorizeRoles([Role.EVENT_MANAGER,])] },
        async (request: FastifyRequest<{ Body: ControllerEventCreate }>, reply: FastifyReply): Promise<BaseEvent> => {
            const requiredFields = ["name", "description", "ts_initial_date", "ts_final_date",
                "base_price", "capacity", "img_banner", "color", "category_id", "location_id"]

            for (const field of requiredFields)
                if (!request.body[field as keyof ControllerEventCreate]?.toString().length)
                    return reply.code(400).send({ error: `Field ${field} is required` });

            const { user: { sub: actorId }, body } = request;

            const eventCreated = await eventService.create(actorId, body);

            return reply.code(201).send(eventCreated);
        });

    api.put('/:eventId', { preHandler: [api.authenticate, api.authorizeRoles([Role.EVENT_MANAGER,])] },
        async (request: FastifyRequest<{
            Params: { eventId: number }, Body: EventUpdate
        }>, reply: FastifyReply): Promise<BaseEvent> => {
            const { body: eventUpdate, params: { eventId } } = request;
            if (!integerRegex.test(eventId.toString()))
                return reply.code(400).send({ message: 'eventId must be valid value.' });

            const validAttributes: (keyof EventUpdate)[] = [
                "name", "description", "ts_initial_date", "ts_final_date", "base_price", "capacity", "img_banner", "color",
                "category_id", "status", "location_id"];
            const validUpdatePayload = validAttributes.reduce((acc, key) => {
                const updateValue = eventUpdate[key];
                if (updateValue !== null && updateValue !== undefined) {
                    (acc as any)[key] = updateValue;
                }
                return acc;
            }, {} as Partial<EventUpdate>);

            const eventCreated = await eventService.modify(eventId, validUpdatePayload);

            return reply.code(201).send(eventCreated);
        });

}
export default EventRoute;

