import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { OrderService } from "../../services/order.service";
import { OrderCreate, PaginatedOrderResult } from "@interfaces/order.interface";
import { Role } from "@prisma/client";
import { orderCreateSchema } from "../../schema/order.schema";
import { QueryPaginationFilter, } from "@interfaces/common.interface";

const OrderRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
    const orderService: OrderService = new OrderService();


    // Endpoint para criar uma nova ordem de compra
    api.post('/', {
        schema: { body: orderCreateSchema, }
        , preHandler: [api.authenticate, api.authorizeRoles([Role.STAFF, Role.SPECTATOR])]
    }, async (request: FastifyRequest<{ Body: OrderCreate }>, reply: FastifyReply) => {
        // 
        const { user: { role: actorRole }, body: orderData } = request;
        try {
            const order = await orderService.create(actorRole as Role, orderData, api);
            return reply.code(201).send(order);
        } catch (error) {
            return reply.code(409).send(error);
        }
    });

    // Endpoint para listar todas as ordens de compra
    api.get<{ Querystring: QueryPaginationFilter }>(
        '/', { preHandler: [api.authenticate, api.authorizeRoles([Role.ADMIN, Role.EVENT_MANAGER, Role.SPECTATOR, Role.STAFF])] },
        async (request: FastifyRequest<{ Querystring: QueryPaginationFilter }>, reply: FastifyReply): Promise<PaginatedOrderResult> => {
            const { query: { filter, paginationParams: { page, pageSize } } } = request;
            const response = await orderService.searchOrders(filter, page, pageSize);
            return reply.code(200).send(response);
        }
    );

    // Endpoint para obter detalhes de uma ordem de compra específica
    api.get<{ Params: { orderId: string } }>('/:orderId', { preHandler: [api.authenticate] },
        async (request: FastifyRequest<{ Params: { orderId: string } }>, reply: FastifyReply) => {
            const { orderId } = request.params;
            try {
                const order = await orderService.getOrderById(orderId);
                if (order) {
                    return reply.code(200).send(order);
                } else {
                    return reply.code(404).send({ message: 'Order not found' });
                }
            } catch (error) {
                return reply.code(500).send(error);
            }
        }
    );
}

export default OrderRoute;
