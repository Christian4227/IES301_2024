import { PaginatedResult } from "@interfaces/common.interface";
import { EventResult, EventUpdate, OrderCriteria,Event } from "@interfaces/event.interface";
export type OrderByArray = OrderCriteria[];
export type PaginatedEventResult = PaginatedResult<EventResult>;

export type QueryPaginationFilterOrder = { filter: string; } & { "page": 1; "page-size": 10; } & { "start-date": number; "end-date"?: number; } & { "order-by"?: string } & { "category-id": number; } &
{ status: string }


// 
export type PartialEventUpdate = Partial<EventUpdate>;
export type EventUniqueResult = Omit<Event, "event_manager">;
