export interface BaseTypeTicket {
    id: number;
    name: string;
    discount: number;
    description: string;
    created_at: Date;
    updated_at: Date;
}
export interface ControllerTicketTypeCreate {
    name: string;
    discount: number;
    description: string;
}