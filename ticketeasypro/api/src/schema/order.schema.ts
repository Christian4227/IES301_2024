export const orderCreateTicketSchema = {
    type: 'object',
    required: ['quantity', 'typeId'],
    properties: {
        ticketId: { type: 'string' },
        seatNumber: { type: 'string' },
        price: { type: 'number' },
    },
};

export const orderCreateSchema = {
    type: 'object',
    required: ['userId', 'eventId', 'quantity', 'tickets'],
    properties: {
        userId: { type: 'string' },
        eventId: { type: 'string' },
        quantity: { type: 'number' },
        orderId: { type: 'string' },
        tickets: {
            type: 'array',
            items: orderCreateTicketSchema,
        },
    },
};
