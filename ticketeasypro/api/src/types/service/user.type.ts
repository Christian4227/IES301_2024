import { Role } from "@prisma/client";
import { PaginatedResult } from "../../interfaces/common.interface";

export type PaginatedUserResult = PaginatedResult<UserResult>;

interface UserResult {
    id: string;
    email: string;
    name: string;
    emailConfirmed?: boolean;
    birth_date: Date;
    phone?: string;
    phone_fix?: string;
    role: Role;
}

export type UserCreateResult = {

    id: string;
    email: string;
    password: string;
    email_confirmed: boolean;
    birth_date: Date;
    name: string;
    phone: string | null;  // Change to nullable since your DB operation might return null
    phone_fix?: string | null; // Allow null as a valid value in addition to undefined
    role: Role;
    salt: string;
    active: boolean;
    created_at: Date;
    updated_at?: Date | null;  // Allow null as a valid value in addition to undefined
}