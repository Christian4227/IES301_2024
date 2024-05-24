import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import TicketTypeService from "@services/ticketType.service"
import { integerRegex } from "@utils/validators";
import { Prisma, Role } from "@prisma/client";
import { PaginatedTicketTypeResult } from "types/ticketType.type";
import { PaginationParams } from "@interfaces/common.interface";
import { BaseTypeTicket, ControllerTicketTypeCreate } from "@interfaces/tycketType.interface";

const mappingOrderCriteria: Record<string, keyof Prisma.TicketTypeOrderByWithRelationInput> = {
    "name": 'name',
    "description": 'description',
    "discount": 'discount'
};

const defaultConfig = {
    page: 1,
    pageSize: 10,
    orderBy: "name:asc,description:asc,discount:desc",
    status: "planned",
    defaultOrderCriteria: [
        { name: "asc" }, { description: "asc" }, { discount: "desc" }
    ] as Prisma.TicketTypeOrderByWithRelationInput

};

type QueryPaginationFilterOrder = { filter: string; } & { "page": 1; "page-size": 10; } & { "order-by"?: string; }

const parseOrderBy = (orderBy: string): Prisma.TicketTypeOrderByWithRelationInput[] => {
    return orderBy.split(',').map(criterion => {
        const [field, direction] = criterion.split(':');
        const mappedField = mappingOrderCriteria[field] || field;
        return { [mappedField]: direction } as Prisma.TicketTypeOrderByWithRelationInput;
    });
};


const TicketTypeRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
    const ticketTypeService: TicketTypeService = new TicketTypeService();

    api.post('/',
        { preHandler: [api.authenticate, api.authorizeRoles([Role.EVENT_MANAGER,])] },
        async (request: FastifyRequest<{ Body: ControllerTicketTypeCreate }>, reply: FastifyReply): Promise<BaseTypeTicket> => {
            const requiredFields = ["name", "discount", "description"];

            const { body } = request;

            for (const field of requiredFields)
                if (!body[field as keyof ControllerTicketTypeCreate]?.toString().length)
                    return reply.code(400).send({ error: `Field ${field} is required` });

            if (!integerRegex.test(body.discount.toString()) && body.discount < 0)
                return reply.code(400).send({ message: 'Discount must be valid integer number.' });

            const eventCreated = await ticketTypeService.create(body);

            return reply.code(201).send(eventCreated);
        });

    api.get<{ Querystring: QueryPaginationFilterOrder }>(
        '/', async (request: FastifyRequest<{ Querystring: QueryPaginationFilterOrder }>, reply: FastifyReply): Promise<PaginatedTicketTypeResult> => {

            const {
                filter, page = defaultConfig.page, "page-size": pageSize = defaultConfig.pageSize, "order-by": orderBy = defaultConfig.orderBy
            } = request.query;

            const parsedOrderBy = parseOrderBy(orderBy);

            const paginationParams: PaginationParams = { page, pageSize };

            const allFilterOrdenedTicketTypes = await ticketTypeService.searchTicketTypes(filter, paginationParams, parsedOrderBy);

            return reply.code(200).send(allFilterOrdenedTicketTypes);
        }
    );
    // api.get('/:eventId', { preHandler: [api.authenticate, api.authorizeRoles([Role.EVENT_MANAGER,])] },
    //     async (request: FastifyRequest<{ Params: { eventId: number } }>, reply: FastifyReply): Promise<EventResult> => {
    //         const { body: eventUpdate, params: { eventId } } = request;
    //         if (!integerRegex.test(eventId.toString()))
    //             return reply.code(400).send({ message: 'eventId must be valid value.' });
    //         const eventFinded = await eventService.getEvent(Number(eventId));

    //         return reply.code(200).send(eventFinded);
    //     }
    // );



    // api.put('/:eventId', { preHandler: [api.authenticate, api.authorizeRoles([Role.EVENT_MANAGER,])] },
    //     async (request: FastifyRequest<{
    //         Params: { eventId: number }, Body: EventUpdate
    //     }>, reply: FastifyReply): Promise<BaseEvent> => {
    //         const { body: eventUpdate, params: { eventId } } = request;
    //         if (!integerRegex.test(eventId.toString()))
    //             return reply.code(400).send({ message: 'eventId must be valid value.' });

    //         const validAttributes: (keyof EventUpdate)[] = [
    //             "name", "description", "ts_initial_date", "ts_final_date", "base_price", "capacity", "img_banner", "color",
    //             "category_id", "status", "location_id"];
    //         const validUpdatePayload = validAttributes.reduce((acc, key) => {
    //             const updateValue = eventUpdate[key];
    //             if (updateValue !== null && updateValue !== undefined) {
    //                 (acc as any)[key] = updateValue;
    //             }
    //             return acc;
    //         }, {} as Partial<EventUpdate>);

    //         const eventCreated = await eventService.update(eventId, validUpdatePayload);

    //         return reply.code(201).send(eventCreated);
    //     });

}
export default TicketTypeRoute;