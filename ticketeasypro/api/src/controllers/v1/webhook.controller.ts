import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { OrderService } from "../../services/order.service";
import { OrderStatus, Prisma } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";
import { PaymentMethod } from "src/schema/order.schema";
import { AnyRole } from "@utils/auth";


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




export const OrderActionParamsSchema = Type.Object({
  orderId: Type.String(),
  action: Type.String(),
});

export const OrderActionBodySchema = Type.Object({
  paymentMethod: Type.Optional(Type.Enum(PaymentMethod, { default: PaymentMethod.PIX }))
})

export type OrderActionParams = Static<typeof OrderActionParamsSchema>;
export type OrderActionBody = Static<typeof OrderActionBodySchema>;

const WebhookRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
  const orderService: OrderService = new OrderService();


  api.post('/:orderId/:action', {
    schema: { params: OrderActionParamsSchema, body: OrderActionBodySchema },
    preHandler: [api.authenticate, api.authorizeRoles(AnyRole)],
  }, async (request: FastifyRequest<{ Params: OrderActionParams, Body?: OrderActionBody }>, reply: FastifyReply) => {
    const { orderId, action } = request.params;
    const paymentMethod = request.body?.paymentMethod;

    try {


      switch (action.toLowerCase()) {
        case 'payment-confirm':
          // Lógica para confirmar o pagamento da ordem
          const order = await orderService.updateOrderStatus(orderId, OrderStatus.COMPLETED, paymentMethod);
          break;
        // Outros casos para diferentes ações
        default:
          return reply.code(400).send({ error: 'InvalidAction' });
      }
      return reply.code(201).send({ message: 'OrderUpdatedSuccessfully' });
    } catch (error) {
      return reply.code(500).send({ error });
    }
  }
  )
};

// );
// // Endpoint para criar uma nova ordem de compra
// api.post('/', {
//   schema: { body: OrderCreateSchema, }
//   , preHandler: [api.authenticate, api.authorizeRoles([Role.STAFF, Role.SPECTATOR])]
// }, async (request: FastifyRequest<{ Body: OrderCreate }>, reply: FastifyReply): Promise<OrderCreate> => {

//   const { user: { sub: customerId }, body: orderData } = request;

//   try {
//     const order = await orderService.createOrderWithOrderTicketsAndTickets(customerId, orderData)
//     return rorderId: string, status: OrderStatus, COMPLETED: stringcatch (error) {
//     return reply.code(409).send(error);
//   }
// });

// // Endpoint para listar todas as ordens de compra
// api.get('/', {
//   schema: { querystring: QueryPaginationFilterOrderSchema },
//   preHandler: [api.authenticate, api.authorizeRoles(AnyRole)]
// },
//   async (request: FastifyRequest<{ Querystring: QueryPaginationFilterOrder }>, reply: FastifyReply): Promise<PaginatedOrderResult> => {

//     const {
//       user: { sub: customerId },
//       query: {
//         page = 1,
//         'page-size': pageSize = 10,
//         'start-date': tsStartDate = getStartOfDayTimestamp(),
//         'end-date': tsEndDate = getLastdayOfNextMonthTimestamp(),
//         national = true, 'order-by': orderBy = 'created-at:asc', 'category-id': categoryId,
//         'order-status': orderStatusParam = OrderStatus.PROCESSING, 'event-status': eventStatusParam = EventStatus.PLANNED,
//       } } = request;
//     const orderCriteria: Prisma.OrderOrderByWithRelationInput[] = parseOrderBy(orderBy ?? 'created-at:asc')

//     const paginationParams: PaginationParams = { page, pageSize };
//     const orderStatus = mappingFilterStatus[orderStatusParam.toLowerCase()]; // deve vir pelo parametro
//     const queryIntervalDate: QueryIntervalDate = { tsStartDate, tsEndDate };

//     const response = await orderService.searchOrders(
//       customerId, paginationParams, orderCriteria, queryIntervalDate, national,
//       eventStatusParam as EventStatus, orderStatus,
//       categoryId)

//     return reply.code(200).send(response);
//   }

// );
// // Rota GET para listar ordens por email
// api.get<{ Querystring: QueryPaginationFilterOrderEmail; }>('/email',
//   {
//     schema: { querystring: QueryPaginationFilterOrderEmailSchema },
//     preHandler: [api.authenticate, api.authorizeRoles(Role.STAFF)],
//   },
//   async (request: FastifyRequest<{ Querystring: QueryPaginationFilterOrderEmail }>, reply: FastifyReply): Promise<PaginatedOrderResult> => {

//     const {
//       query: {
//         "customer-email": customerEmail,
//         page = 1,
//         'page-size': pageSize = 10,
//         'start-date': tsStartDate = getStartOfDayTimestamp(),
//         'end-date': tsEndDate = getLastdayOfNextMonthTimestamp(),
//         national = true, 'order-by': orderBy = 'created-at:asc', 'category-id': categoryId,
//         'order-status': orderStatusParam = OrderStatus.PROCESSING, 'event-status': eventStatusParam = EventStatus.PLANNED,
//       }
//     } = request;

//     const orderCriteria: Prisma.OrderOrderByWithRelationInput[] = parseOrderBy(orderBy ?? 'created-at:asc');
//     const paginationParams: PaginationParams = { page, pageSize };
//     const orderStatus = mappingFilterStatus[orderStatusParam.toLowerCase()];
//     const queryIntervalDate: QueryIntervalDate = { tsStartDate, tsEndDate };

//     try {
//       const order = await orderService.searchOrdersByEmail(
//         customerEmail, paginationParams, orderCriteria, queryIntervalDate, national, eventStatusParam, orderStatus, categoryId
//       );
//       return reply.code(200).send(order);
//     } catch (error) {
//       return reply.code(404).send(error);
//     }
//   }
// );
// }
export default WebhookRoute;


