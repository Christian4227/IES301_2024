import { OrderStatus, PaymentMethod, Prisma } from "@prisma/client";
// import { OrderTicket } from "src/schema/orderTicket.schema";

export type QueryPaginationFilterOrder = { "page": 1; "page-size": 10; }
    & { "order-by"?: string } & {
        status: OrderStatus
    } & {
        customerId: string, eventId: number, payment_method: PaymentMethod

    }

// export enum PaymentMethod {
//     PIX = 'PIX',
//     CREDIT_CARD = 'CREDIT_CARD',
//     DEBIT_CARD = 'DEBIT_CARD',
//     BANK_SLIP = 'BANK_SLIP',
// }

export interface RepoOrderCreate {
    eventId: number;
    paymentMethod: PaymentMethod;
    // orderTickets: OrderTicket[];
};
export interface OrderResult {

}
// enum OrderStatus {
//     PROCESSING = "PROCESSING",
//     COMPLETED = "COMPLETED",
//     CANCELLED = "CANCELLED"
// }

// enum PaymentMethod {
//     CREDIT_CARD = "CREDIT_CARD",
//     DEBIT_CARD = "DEBIT_CARD",
//     BANK_SLIP = "BANK_SLIP",
//     PIX = "PIX"
// }


// Order Interface
export interface Order {
    id: string;
    customer_id: string;
    event_id: number;
    total_amount: number;
    status: OrderStatus;
    payment_method: PaymentMethod;
    created_at: Date;
    updated_at: Date;
}

// // OrderTicket Interface
// export interface OrderTicket {
//     id: number;
//     order_id: string;
//     unit_price: number;
//     created_at: Date;
//     updated_at: Date;
//     type_id: number;
//     type: TicketType;
// }

// // Interfaces para criação de registros
// export interface OrderCreate {
//     eventId: number,
//     payment_method: PaymentMethod,
//     orderTicketsData: OrderTicket[],
// };

// export interface OrderTicketCreate {
//     typeId: number;
//     quantity: number;
// };

// // Interfaces para atualização de registros
// export interface OrderUpdate {
//     customerId?: string;
//     eventId?: number;
//     totalAmount?: number;
//     status?: OrderStatus;
//     paymentMethod?: PaymentMethod;
// }

// export interface OrderTicketUpdate {
//     order_id?: string;
//     unit_price?: number;
//     type_id?: number;
// }

// // Interfaces para resultado de paginação
// export interface PaginatedOrderResult {
//     data: Order[];
//     total: number;
// }

// export interface PaginatedOrderTicketResult {
//     data: OrderTicket[];
//     total: number;
// }

// // interfaces repositorio
// export interface OrderCreateInput {
//     customerId: string;
//     eventId: number;
//     totalAmount: number;
//     paymentMethod: PaymentMethod;
// }

// export interface OrderUpdateInput {
//     status?: OrderStatus;
//     paymentMethod?: PaymentMethod;
// }
