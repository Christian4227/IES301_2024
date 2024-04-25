import { Role } from "@prisma/client";

export interface User {
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
    updated_at: Date;
}

export interface UserCreate {
    email: string;
    name: string;
    birth_date: Date;
    phone: string;
    phone_fix?: string;
    password: string
    salt: string
    role: Role
}

export interface UserCredentials {
    email: string;
    password: string

}
