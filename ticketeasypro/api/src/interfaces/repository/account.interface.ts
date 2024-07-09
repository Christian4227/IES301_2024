import { Prisma, Role } from "@prisma/client";


export interface AccountResult {
    id: string;
    email: string;
    name: string;
    email_confirmed?: boolean;
    birth_date: Date;
    phone: string;
    phone_fix?: string | null;
    role: Role;
    active: boolean
}
interface CommonAccountData {
    email: string;
    name: string;
    birth_date: Date;

    phone: string;
    phone_fix?: string | null;
}

export interface AccountCreate extends CommonAccountData {
    role: Role;
    password: string;
    salt: string;
}

export interface AccountCreateResult {
    id: string;
    email: string;
    name: string;
    email_confirmed?: boolean;
    birth_date: Date;
    phone: string;
    phone_fix?: string | null;
    password: string
    role: Role;
    salt: string;
}

export interface Account {
    id: string;
    email: string;
    name: string;
    email_confirmed?: boolean;
    birth_date: Date;
    phone: string;
    phone_fix?: string | null;
    role: string;
    password: string;
    salt: string;
    active: boolean;
    created_at: Date;
    updated_at?: Date | null;
}

export interface AccountUpdate {
    email_confirmed?: boolean;
    role?: Role;
    status?: boolean;
    email?: string;
    token?: string
    token_expires?: Date
}

export interface AccountSortParams {
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    birth_date?: Prisma.SortOrder;
}