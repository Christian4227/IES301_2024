import { Static } from "@sinclair/typebox";
import { PaginatedResult } from "@interfaces/common.interface";
import { EventResult, EventUpdate, OrderCriteria, Event } from "@interfaces/event.interface";
import { QueryPaginationFilterEventSchema } from "src/schema/event.schema";

export type OrderByArray = OrderCriteria[];
export type PaginatedEventResult = PaginatedResult<EventResult>;

export type QueryPaginationFilterEvent = Static<typeof QueryPaginationFilterEventSchema>;

export type PartialEventUpdate = Partial<EventUpdate>;
export type EventUniqueResult = Omit<Event, "event_manager">;
