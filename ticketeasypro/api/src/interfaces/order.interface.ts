import { OrderStatus, PaymentMethod } from "@prisma/client";


export interface RepoOrderCreate {
    eventId: number;
    paymentMethod: PaymentMethod;
}
export interface OrderResult {

}
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
