import { EventStatus } from '@prisma/client';
import { Type, Static } from '@sinclair/typebox';
import { getLastdayOfNextMonthTimestamp, getStartOfDayTimestamp } from '@utils/mixes';



// Definição do schema usando Typebox
export const QueryPaginationFilterEventSchema = Type.Object({
    "customer-id": Type.Optional(Type.String()),
    filter: Type.Optional(Type.String({ default: '' })),
    'start-date': Type.Optional(Type.Integer({ default: () => getStartOfDayTimestamp() })),
    'end-date': Type.Optional(Type.Integer({ default: () => getLastdayOfNextMonthTimestamp() })),
    'page': Type.Integer({ minimum: 1, default: 1 }),
    'page-size': Type.Integer({ default: 10, minimum: 1, maximum: 50 }),
    'order-by': Type.Optional(Type.String({ default: 'created-at:asc' })),
    'category-id': Type.Optional(Type.Integer()),
    'status': Type.Enum(EventStatus, { default: EventStatus.PLANNED }),
    'uf': Type.Optional(Type.String({ default: '' }))
});

// status: Type.Enum(OrderStatus, { default: OrderStatus.PROCESSING }),
