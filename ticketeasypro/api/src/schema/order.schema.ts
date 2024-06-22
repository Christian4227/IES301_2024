import { Static, Type } from '@sinclair/typebox';
import { OrderTicketSchema } from './orderTicket.schema';
// import { EventStatus, OrderStatus } from '@prisma/client';

export enum PaymentMethod { PIX = 'PIX', CREDIT_CARD = 'CREDIT_CARD', DEBIT_CARD = 'DEBIT_CARD', BANK_SLIP = 'BANK_SLIP' }
enum OrderStatus { PROCESSING = "PROCESSING", COMPLETED = "COMPLETED", CANCELLED = "CANCELLED" }

enum EventStatus { PLANNED = "PLANNED", IN_PROGRESS = "IN_PROGRESS", COMPLETED = "COMPLETED", CANCELLED = "CANCELLED" }

export const OrderCreateSchema = Type.Object({
    eventId: Type.Number(),
    paymentMethod: Type.Enum(PaymentMethod),
    orderTickets: Type.Array(OrderTicketSchema),
});

// export const QueryPaginationFilterOrderSchema = Type.Object({
//     page: Type.Integer({ minimum: 1, default: 1 }),
//     'page-size': Type.Integer({ minimum: 1, default: 10, maximum: 50 }),
//     'order-by': Type.Optional(Type.String({ default: 'created-at:asc' })),
//     status: Type.Enum(OrderStatus, { default: OrderStatus.PROCESSING }),
//     'event-id': Type.Optional(Type.Integer()),  // Tornando 'event-id' opcional
//     'payment-method': Type.Enum(PaymentMethod, { default: PaymentMethod.PIX })
// });

export const QueryPaginationFilterOrderSchema = Type.Object({
    'page': Type.Integer({ minimum: 1, default: 1 }),
    'page-size': Type.Integer({ default: 10, minimum: 1, maximum: 50 }),
    'start-date': Type.Optional(Type.Integer()),
    'end-date': Type.Optional(Type.Integer()),
    'national': Type.Boolean({ default: true }),
    'order-by': Type.Optional(Type.String({ default: 'created-at:asc' })),
    'category-id': Type.Optional(Type.Integer()),
    'order-status': Type.Optional(Type.Enum(OrderStatus, { default: OrderStatus.PROCESSING })),
    'event-status': Type.Optional(Type.Enum(EventStatus, { default: EventStatus.PLANNED })),
});

export const QueryPaginationFilterOrderEmailSchema = Type.Object({
    'customer-email': Type.String(),
    'page': Type.Integer({ minimum: 1, default: 1 }),
    'page-size': Type.Integer({ default: 10, minimum: 1, maximum: 50 }),
    'start-date': Type.Optional(Type.Integer()),
    'end-date': Type.Optional(Type.Integer()),
    'national': Type.Boolean({ default: true }),
    'order-by': Type.Optional(Type.String({ default: 'created-at:asc' })),
    'category-id': Type.Optional(Type.Integer()),
    'order-status': Type.Optional(Type.Enum(OrderStatus, { default: OrderStatus.PROCESSING })),
    'event-status': Type.Optional(Type.Enum(EventStatus, { default: EventStatus.PLANNED })),
});


// Definição do schema para os parâmetros de rota
export const OrderDetailParamsSchema = Type.Object({
    orderId: Type.String(), // Definindo orderId como uma string
});

export const CustomerEmailParamsSchema = Type.Object({
    customerEmail: Type.String(), // Definindo orderId como uma string
});

