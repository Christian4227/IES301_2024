import { Role } from "@prisma/client";
import { PaginatedResult } from "../common.interface";


// export interface AccountCreate {
//     email: string;
//     name: string;
//     birth_date: Date;
//     phone: string;
//     phone_fix?: string;
//     password: string;
//     confirm_password: string
// }


interface AccountBase {
    id: string;
    email: string;
    name: string;
    email_confirmed?: boolean;
    birth_date: Date;
    phone?: string | null;
    phone_fix?: string | null;
    role: Role;

}

export interface AccountCreate {
    id: string;
    email: string;
    name: string;
    email_confirmed?: boolean;
    birth_date: Date;
    phone: string;
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
    id: string;
    email: string;
    name: string;
    email_confirmed?: boolean;
    birth_date: Date;
    phone?: string | null;
    phone_fix?: string | null;
    role: Role;
    password: string
    salt: string
    created_at: Date;
    updated_at?: Date | null;
}

export interface AccountResult {
    id: string;
    email: string;
    name: string;
    email_confirmed?: boolean;
    birth_date: Date;
    phone?: string | null;
    phone_fix?: string | null;
    role: Role;
}

export type PaginatedAccountResult = PaginatedResult<AccountResult>;


export interface AccountUpdate {
    role?: Role;
    status?: boolean
    email?: string;
};

export interface AccountRoleUpdate {
    role: Role;
};

export interface UserCredentials {

}