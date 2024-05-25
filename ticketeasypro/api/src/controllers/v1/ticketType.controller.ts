import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import TicketTypeService from "@services/ticketType.service"
import { integerRegex } from "@utils/validators";
import { Prisma, Role } from "@prisma/client";
import { PaginatedTicketTypeResult, PartialTypeTicket } from "types/ticketType.type";
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
        { preHandler: [api.authenticate, api.authorizeRoles([Role.EVENT_MANAGER, Role.ADMIN,])] },
        async (request: FastifyRequest<{ Body: ControllerTicketTypeCreate }>, reply: FastifyReply): Promise<BaseTypeTicket> => {
            const requiredFields = ["name", "discount", "description"];

            const { body } = request;

            for (const field of requiredFields)
                if (!body[field as keyof ControllerTicketTypeCreate]?.toString().length)
                    return reply.code(400).send({ error: `Field ${field} is required` });

            if (!integerRegex.test(body.discount.toString()) || body.discount < 0 || body.discount > 100)
                return reply.code(400).send({ message: 'Discount must be valid integer value.' });

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
    api.get('/:ticketTypeId', { preHandler: [api.authenticate, api.authorizeRoles(Role.EVENT_MANAGER, Role.ADMIN,)] },
        async (request: FastifyRequest<{ Params: { ticketTypeId: number } }>, reply: FastifyReply): Promise<BaseTypeTicket> => {
            const { params: { ticketTypeId } } = request;
            if (!integerRegex.test(ticketTypeId.toString()))
                return reply.code(400).send({ message: 'ticketTypeId must be valid value.' });
            const ticketType = await ticketTypeService.getTicketTypes(Number(ticketTypeId));

            return reply.code(200).send(ticketType);
        }
    );



    api.put('/:ticketTypeId', { preHandler: [api.authenticate, api.authorizeRoles([Role.EVENT_MANAGER,])] },
        async (
            request: FastifyRequest<{ Params: { ticketTypeId: number }, Body: PartialTypeTicket }>,
            reply: FastifyReply): Promise<BaseTypeTicket> => {
            const { body: typeTicketToUpdate } = request;
            let { params: { ticketTypeId } } = request;
            // Validate ticketTypeId            
            if (!integerRegex.test(ticketTypeId.toString()))
                return reply.code(400).send({ message: 'ticketTypeId must be a valid integer value.' });

            if (!typeTicketToUpdate)
                return reply.code(400).send({ message: 'Ticket type update data is missing.' });

            const validAttributes: (keyof PartialTypeTicket)[] = ["name", "discount", "description"];

            const validUpdatePayload: PartialTypeTicket = validAttributes.reduce((acc, key) => {
                const updateValue = typeTicketToUpdate[key];
                if (updateValue !== null && updateValue !== undefined)
                    (acc as any)[key] = updateValue;
                return acc;
            }, {} as PartialTypeTicket);



            ticketTypeId = Number(ticketTypeId);
            // Perform the update
            const updatedTicketType = await ticketTypeService.modify(ticketTypeId, validUpdatePayload);
            return reply.code(200).send(updatedTicketType);
        }
    )

}
export default TicketTypeRoute;