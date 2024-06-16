import { Static, Type } from '@sinclair/typebox';
import { OrderTicketSchema } from './orderTicket.schema';

export enum PaymentMethod {
    PIX = 'PIX',
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    BANK_SLIP = 'BANK_SLIP',
}

export const OrderCreateSchema = Type.Object({
    eventId: Type.Number(),
    paymentMethod: Type.Enum(PaymentMethod),
    orderTickets: Type.Array(OrderTicketSchema),
});

export type OrderCreate = Static<typeof OrderCreateSchema>;
