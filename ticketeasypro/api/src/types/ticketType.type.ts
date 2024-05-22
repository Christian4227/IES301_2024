import { PaginatedResult } from "@interfaces/common.interface";
import { BaseTypeTicket } from "@interfaces/tycketType.interface";

type PaginatedTicketTypeResult = PaginatedResult<BaseTypeTicket>;
type TypeTicketCreate = Omit<BaseTypeTicket, "id" | "created_at" | "updated_at">;
export { TypeTicketCreate, PaginatedResult }
