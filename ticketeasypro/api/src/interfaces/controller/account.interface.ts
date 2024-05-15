

import { Role } from "@prisma/client";
import { PaginatedResult } from "../common.interface";

export type PaginatedAccountResult = PaginatedResult<Account>;

export interface AccountCreateResult {
    id: string;
    email: string;
    name: string;
    emailConfirmed?: boolean;
    birth_date: Date;
    phone?: string | null;
    phone_fix?: string | null;
    role: Role;

}
export interface AccountUpdateResult {
    id: string;
    email: string;
    name: string;
    email_confirmed?: boolean;
    birth_date: Date;
    phone?: string | null;
    phone_fix?: string | null;
    role: Role;

}

export interface Account {
    id: string,
    email: string;
    name: string;
    phone: string;
    role: Role;
}
export interface AccountCreate {
    email: string;
    name: string;
    birth_date: Date;
    phone: string;
    phone_fix?: string;
    password: string;
    confirm_password: string
    role: Role;
}
export interface AccountRoleUpdate {
    role: Role;
};
export interface QueryPaginationFilter {
    page: number,
    pageSize: number;
    filter: string;
    role?: string;
}