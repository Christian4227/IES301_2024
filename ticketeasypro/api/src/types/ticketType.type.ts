import { PaginatedResult } from "@interfaces/common.interface";
import { BaseTypeTicket } from "@interfaces/tycketType.interface";

export type PaginatedTicketTypeResult = PaginatedResult<BaseTypeTicket>;
export type TypeTicketCreate = Omit<BaseTypeTicket, "id" | "created_at" | "updated_at">;
export type PartialTypeTicket = Partial<Omit<BaseTypeTicket, "id" | "created_at" | "updated_at">>;



