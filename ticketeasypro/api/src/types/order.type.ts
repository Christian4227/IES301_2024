import { PaginatedResult } from "@interfaces/common.interface";
import { OrderResult, Order } from "@interfaces/order.interface";
import { Static } from "@sinclair/typebox";
import { OrderCreateSchema, OrderDetailParamsSchema, CustomerEmailParamsSchema,
     QueryPaginationFilterOrderSchema, QueryPaginationFilterOrderEmailSchema } from "src/schema/order.schema";

export type PaginatedOrderResult = PaginatedResult<OrderResult>;

export type QueryPaginationFilterOrder = Static<typeof QueryPaginationFilterOrderSchema>;
export type QueryPaginationFilterOrderEmail = Static<typeof QueryPaginationFilterOrderEmailSchema>;

export type PartialOrderUpdate = Partial<Order>;

// Tipagem estática do schema para garantir consistência
export type OrderDetailParams = Static<typeof OrderDetailParamsSchema>;
export type OrderCreate = Static<typeof OrderCreateSchema>;
export type CustomerEmailParams = Static<typeof CustomerEmailParamsSchema>;