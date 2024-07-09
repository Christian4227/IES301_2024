import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { OrderService } from "../../services/order.service";
import { OrderStatus, Prisma } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";
import { PaymentMethod } from "src/schema/order.schema";
import { AnyRole } from "@utils/auth";
import { ReadableStream } from "stream/web";


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
  paymentMethod: Type.Optional(Type.Enum(PaymentMethod, { default: PaymentMethod.PIX })),
  file: Type.Object({}),
})

export type OrderActionParams = Static<typeof OrderActionParamsSchema>;
export type OrderActionBody = Static<typeof OrderActionBodySchema>;

const WebhookRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
  const orderService: OrderService = new OrderService();

  api.post('/:orderId/:action', {
    schema: { params: OrderActionParamsSchema },
    preHandler: [api.authenticate, api.authorizeRoles(AnyRole)],
  }, async (request: FastifyRequest<{ Params: OrderActionParams, Body?: any }>, reply: FastifyReply) => {
    const { orderId, action } = request.params;
    let paymentMethod: PaymentMethod = PaymentMethod.PIX;
    let file: any;

    if (request.isMultipart()) {
      const parts = request.parts();
      for await (const part of parts) {
        if (part.fieldname == 'paymentMethod') {
          paymentMethod = Object.values(PaymentMethod).includes(part.toString() as PaymentMethod)
          ? part.toString() as PaymentMethod
          : PaymentMethod.CREDIT_CARD;
        } else if (part.fieldname == 'file') {
          file = part;
          break;
        }
      }
    }

    if (!request.isMultipart() && action.toLocaleLowerCase() == 'payment-confirm') {
      return reply.code(400).send({ error: 'Não foi possível receber o arquivo.' });
    }

    try {

      let order;
      switch (action.toLowerCase()) {
        case 'payment-confirm':
          // Lógica para confirmar o pagamento da ordem
          order = await orderService.updateOrderStatus(orderId, OrderStatus.COMPLETED, paymentMethod);
          await orderService.sendTicketsQrCodeForEmail(order.id, false, file.file);
          break;
        case 'cancel':
          // Lógica para cancelar o pagamento da ordem
          order = await orderService.updateOrderStatus(orderId, OrderStatus.CANCELLED, paymentMethod);
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

export default WebhookRoute;


