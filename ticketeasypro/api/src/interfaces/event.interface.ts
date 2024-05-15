import { Category, EventStatus, Prisma, Ticket, User, Venue } from "@prisma/client";


export interface ControllerEventCreate {
    name: string;
    description: string;
    ts_initial_date: number;
    ts_final_date: number;
    status: EventStatus;
    base_price: number;
    capacity: number;
    img_banner: string;
    img_thumbnail: string | null;
    color: string;
    category_id: number;
    location_id: number;
};

export interface Event {
    id: number;
    name: string;
    description: string;
    initial_date: Date;
    final_date: Date;
    status: EventStatus;
    base_price: number;
    capacity: number;
    img_banner: string;
    img_thumbnail: string | null;
    color: string;
    category: Category;
    event_manager: User;
    location: Venue;
    tickets?: Ticket[];
}
export interface EventCreate {
    // id: number;
    name: string;
    description: string;
    ts_initial_date: number;
    ts_final_date: number;
    status: EventStatus;
    base_price: number;
    capacity: number;
    img_banner: string;
    img_thumbnail: string | null;
    color: string;
    category_id: number;
    location_id: number;
};
export interface RepoEventCreate {
    name: string;
    description: string;
    initial_date: Date;
    final_date: Date;
    status: EventStatus;
    base_price: number;
    capacity: number;
    img_banner: string;
    img_thumbnail: string | null;
    color: string;
    category_id: number;
    manager_id: string;
    location_id: number;
};

export interface EventResult extends EventCreate { };
export interface EventCreateResult extends EventCreate { };

export interface EventUpdateResult extends EventCreate { };

export interface BaseEvent {
    name: string;
    description: string;
    initial_date: Date;
    final_date: Date;
    status: EventStatus;
    base_price: number;
    capacity: number;
    img_banner: string;
    img_thumbnail: string | null;
    color: string;
    category_id: number;
    manager_id: string;
    location_id: number;
};

export interface EventUpdate extends EventCreate { };

export interface EventSortParams {

    name?: Prisma.SortOrder;
    initial_date?: Prisma.SortOrder;
    final_date?: Prisma.SortOrder;
};

interface EventOrder {
    field: string; // The field to sort by (e.g., "name", "initial_date", "final_date")
    direction: Prisma.SortOrder;
}


export interface OrderCriteria {
    name?: Prisma.SortOrder;
    initial_date?: Prisma.SortOrder;
    final_date?: Prisma.SortOrder;
}

