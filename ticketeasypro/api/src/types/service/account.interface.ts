import { Role } from "@prisma/client";

export interface Account {
    id: string;
    email: string;
    name: string;
    emailConfirmed?: boolean;
    birth_date: Date;
    phone?: string | null;
    phone_fix?: string | null;
    role: string;
    password: string
    salt: string
    created_at: Date;
    updated_at?: Date | null;
}



export interface AccountUpdate {
    id: string;
    role: Role;
    status?: boolean
    email?: string;
}
