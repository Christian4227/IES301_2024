export interface BaseTypeTicket {
    id: number;
    name: string;
    discount: number;
    description: string;
}
export interface ControllerTicketTypeCreate {
    name: string;
    discount: number;
    description: string;
}