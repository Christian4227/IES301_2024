import { Event } from "./event.interface";
import { User } from "./user.interface";
import { TicketType } from "@prisma/client";


enum OrderStatus {
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

enum PaymentMethod {
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    BANK_SLIP = "BANK_SLIP",
    PIX = "PIX"
}
// Order Interface
export interface Order {
    id: string;
    customer_id: string;
    event_id: number;
    total_amount: bigint;
    status: OrderStatus;
    payment_method: PaymentMethod;
    created_at: Date;
    updated_at: Date;
    event: Event;
    customer: User;
}

// OrderTicket Interface
export interface OrderTicket {
    id: number;
    order_id: string;
    unit_price: number;
    created_at: Date;
    updated_at: Date;
    type_id: number;
    type: TicketType;
}



// Interfaces para criação de registros
export interface OrderCreate {
    customer_id: string;
    event_id: number;
    total_amount: bigint;
    payment_method: PaymentMethod;
}

export interface OrderTicketCreate {
    order_id: string;
    unit_price: number;
    type_id: number;
}

// Interfaces para atualização de registros
export interface OrderUpdate {
    customer_id?: string;
    event_id?: number;
    total_amount?: bigint;
    status?: OrderStatus;
    payment_method?: PaymentMethod;
}

export interface OrderTicketUpdate {
    order_id?: string;
    unit_price?: number;
    type_id?: number;
}

// Interfaces para resultado de paginação
export interface PaginatedOrderResult {
    data: Order[];
    total: number;
}

export interface PaginatedOrderTicketResult {
    data: OrderTicket[];
    total: number;
}

export interface QueryPaginationFilter {
    filter?: string;
    page?: number;
    pageSize?: number;
}

// interfaces repositorio
export interface OrderCreateInput {
    customerId: string;
    eventId: number;
    totalAmount: bigint;
    paymentMethod: PaymentMethod;
}

export interface OrderUpdateInput {
    status?: OrderStatus;
    paymentMethod?: PaymentMethod;
}
