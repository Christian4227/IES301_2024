import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { OrderService } from "../../services/order.service";
import { EventStatus, OrderStatus, Prisma, Role } from "@prisma/client";
import { OrderCreateSchema, OrderDetailParamsSchema, QueryPaginationFilterOrderEmailSchema, QueryPaginationFilterOrderSchema } from "../../schema/order.schema";
import { PaginationParams, QueryIntervalDate } from "@interfaces/common.interface";
import {
  PaginatedOrderResult, QueryPaginationFilterOrder, OrderCreate, OrderDetailParams,
  CustomerEmailParams,
  QueryPaginationFilterOrderEmail
} from "types/order.type";
import { AnyRole } from "@utils/auth";
import { getLastdayOfNextMonthTimestamp, getStartOfDayTimestamp } from "@utils/mixes";



const mappingFilterStatus: Record<string, OrderStatus> = {
  "processing": OrderStatus.PROCESSING,
  "completed": OrderStatus.COMPLETED,
  "cancelled": OrderStatus.CANCELLED,
};

const mappingOrderCriteria: Record<string, string> = {
  "created-at": "created_at"
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
  api.get('/', {
    schema: { querystring: QueryPaginationFilterOrderSchema },
    preHandler: [api.authenticate, api.authorizeRoles(AnyRole)]
  },
    async (request: FastifyRequest<{ Querystring: QueryPaginationFilterOrder }>, reply: FastifyReply): Promise<PaginatedOrderResult> => {

      const {
        user: { sub: customerId },
        query: {
          page = 1,
          'page-size': pageSize = 10,
          'start-date': tsStartDate = getStartOfDayTimestamp(),
          'end-date': tsEndDate = getLastdayOfNextMonthTimestamp(),
          national = true, 'order-by': orderBy = 'created-at:asc', 'category-id': categoryId,
          'order-status': orderStatusParam = OrderStatus.PROCESSING, 'event-status': eventStatusParam = EventStatus.PLANNED,
        } } = request;
      const orderCriteria: Prisma.OrderOrderByWithRelationInput[] = parseOrderBy(orderBy ?? 'created-at:asc')

      const paginationParams: PaginationParams = { page, pageSize };
      const orderStatus = mappingFilterStatus[orderStatusParam.toLowerCase()]; // deve vir pelo parametro
      const queryIntervalDate: QueryIntervalDate = { tsStartDate, tsEndDate };

      const response = await orderService.searchOrders(
        customerId, paginationParams, orderCriteria, queryIntervalDate, national,
        eventStatusParam as EventStatus, orderStatus,
        categoryId)

      return reply.code(200).send(response);
    }

  );
  // Rota GET para listar ordens por email
  api.get<{ Querystring: QueryPaginationFilterOrderEmail; }>('/email',
    {
      schema: { querystring: QueryPaginationFilterOrderEmailSchema },
      preHandler: [api.authenticate, api.authorizeRoles(Role.STAFF)],
    },
    async (request: FastifyRequest<{ Querystring: QueryPaginationFilterOrderEmail }>, reply: FastifyReply): Promise<PaginatedOrderResult> => {

      const {
        query: {
          "customer-email": customerEmail,
          page = 1,
          'page-size': pageSize = 10,
          'start-date': tsStartDate = getStartOfDayTimestamp(),
          'end-date': tsEndDate = getLastdayOfNextMonthTimestamp(),
          national = true, 'order-by': orderBy = 'created-at:asc', 'category-id': categoryId,
          'order-status': orderStatusParam = OrderStatus.PROCESSING, 'event-status': eventStatusParam = EventStatus.PLANNED,
        }
      } = request;

      const orderCriteria: Prisma.OrderOrderByWithRelationInput[] = parseOrderBy(orderBy ?? 'created-at:asc');
      const paginationParams: PaginationParams = { page, pageSize };
      const orderStatus = mappingFilterStatus[orderStatusParam.toLowerCase()];
      const queryIntervalDate: QueryIntervalDate = { tsStartDate, tsEndDate };

      try {
        const order = await orderService.searchOrdersByEmail(
          customerEmail, paginationParams, orderCriteria, queryIntervalDate, national, eventStatusParam, orderStatus, categoryId
        );
        return reply.code(200).send(order);
      } catch (error) {
        return reply.code(404).send(error);
      }
    }
  );


  // Endpoint para obter detalhes de uma ordem de compra específica
  api.get('/:orderId', { schema: { params: OrderDetailParamsSchema }, preHandler: [api.authenticate] },
    async (request: FastifyRequest<{ Params: OrderDetailParams }>, reply: FastifyReply) => {
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


