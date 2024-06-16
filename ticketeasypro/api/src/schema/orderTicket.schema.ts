import { Static, Type } from '@sinclair/typebox';

export const OrderTicketSchema = Type.Object({
    typeId: Type.Number(),
    quantity: Type.Number({ minimum: 1, maximum: 5 })
});

export type OrderTicket = Static<typeof OrderTicketSchema>;
