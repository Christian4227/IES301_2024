import { PaginatedResult } from "@interfaces/common.interface";
// import { OrderCriteria } from "@interfaces/event.interface";
import { OrderResult, Order } from "@interfaces/order.interface";
// export type OrderByArray = OrderCriteria[];
export type PaginatedOrderResult = PaginatedResult<OrderResult>;

// export type QueryPaginationFilterOrder = { filter: string; } & { "page": 1; "page-size": 10; } & { "start-date": number; "end-date"?: number; } & { "order-by"?: string } & { "category-id": number; } &
// { status: string, country: string, uf: string }


// 
export type PartialOrderUpdate = Partial<Order>;
// export type OrderUniqueResult = Omit<Order, "">;
