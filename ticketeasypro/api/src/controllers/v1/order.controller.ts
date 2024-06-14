import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { OrderService } from "../../services/order.service";
import { OrderStatus, Prisma, Role } from "@prisma/client";
import { OrderCreate, OrderCreateSchema, PaymentMethod } from "../../schema/order.schema";
import { PaginationParams, QueryPaginationFilter, } from "@interfaces/common.interface";
import { PaginatedOrderResult } from "types/order.type";
import { QueryPaginationFilterOrder } from "@interfaces/order.interface";


const mappingFilterStatus: Record<string, OrderStatus> = {
  "processing": OrderStatus.PROCESSING,
  "completed": OrderStatus.COMPLETED,
  "cancelled": OrderStatus.CANCELLED,
};

const mappingOrderCriteria: Record<string, string> = {
  "created-at": "created_at"
};

const defaultConfig = {
  page: 1,
  pageSize: 10,
  orderBy: "created-at:asc",
  status: "processing",
  defaultOrderCriteria: [{ created_at: "asc" }] as Prisma.OrderOrderByWithRelationInput[],
  payment_method: PaymentMethod.PIX as PaymentMethod,

};

const parseOrderBy = (orderBy: string): Prisma.OrderOrderByWithRelationInput[] => {
  return orderBy.split(',').map(criterion => {
    const [field, direction] = criterion.split(':');
    const mappedField = mappingOrderCriteria[field] || field;
    return { [mappedField]: direction } as Prisma.OrderOrderByWithRelationInput;
  });
};


const OrderRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
  const orderService: OrderService = new OrderService();

  // Endpoint para criar uma nova ordem de compra
  api.post('/', {
    schema: { body: OrderCreateSchema, }
    , preHandler: [api.authenticate, api.authorizeRoles([Role.STAFF, Role.SPECTATOR])]
  }, async (request: FastifyRequest<{ Body: OrderCreate }>, reply: FastifyReply): Promise<OrderCreate> => {

    const { user: { sub: customerId }, body: orderData } = request;

    try {
      const order = await orderService.createOrderWithOrderTicketsAndTickets(customerId, orderData)
      return reply.code(201).send(order);
    } catch (error) {
      return reply.code(409).send(error);
    }
  });

  // Endpoint para listar todas as ordens de compra
  api.get<{ Querystring: QueryPaginationFilterOrder }>(
    '/', { preHandler: [api.authenticate, api.authorizeRoles([Role.ADMIN, Role.EVENT_MANAGER, Role.SPECTATOR, Role.STAFF])] },
    async (request: FastifyRequest<{ Querystring: QueryPaginationFilterOrder }>, reply: FastifyReply): Promise<PaginatedOrderResult> => {

      const {
        page = defaultConfig.page,
        "page-size": pageSize = defaultConfig.pageSize,
        "order-by": orderBy = defaultConfig.orderBy, status = defaultConfig.status,
        customerId, eventId, payment_method
      } = request.query;

      const orderCriteria = orderBy ? parseOrderBy(orderBy) : defaultConfig.defaultOrderCriteria;

      const paginationParams: PaginationParams = { page, pageSize };
      const orderStatus = mappingFilterStatus[status];

      const response = await orderService.searchOrders(
        customerId, eventId, orderCriteria, paginationParams,
        orderStatus, payment_method as PaymentMethod
      );
      return reply.code(200).send(response);
    }
  );

  // Endpoint para obter detalhes de uma ordem de compra específica
  api.get<{ Params: { orderId: string } }>('/:orderId', { preHandler: [api.authenticate] },
    async (request: FastifyRequest<{ Params: { orderId: string } }>, reply: FastifyReply) => {
      const { orderId } = request.params;
      try {
        const order = await orderService.getOrderById(orderId);
        return reply.code(200).send(order);
      } catch (error) {
        return reply.code(404).send(error);
      }
    }
  );
}

export default OrderRoute;
