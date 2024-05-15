import { CookieSerializeOptions } from "@fastify/cookie";
import { FastifyJwtSignOptions, SignPayloadType } from "@fastify/jwt";
import { Prisma, Role } from "@prisma/client";
import { FastifyReply } from "fastify";


export interface UserResult {
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

export interface AsignJwt {
    (payload: SignPayloadType, options?: FastifyJwtSignOptions): Promise<string>
}
export interface AsignCookie {
    (cookieName: string, toke: string, options: Object): Promise<any>
}

export interface SetCookie {
    (name: string, value: string, options?: CookieSerializeOptions): FastifyReply;
}

export interface User {
    id: string;
    email: string;
    name: string;
    emailConfirmed?: boolean;
    birth_date: Date;
    phone?: string
    phone_fix?: string
    role: string;
    password: string
    salt: string
    created_at: Date;
    updated_at?: Date
}

export interface UserUpdate {
    name?: string;
    birth_date?: Date;
    phone?: string;
    phone_fix?: string;
    active?: boolean;
};

interface CommonUserData {
    email: string;
    name: string;
    emailConfirmed?: boolean;
    birth_date: Date;
    phone: string
    phone_fix?: string
}

export interface UserCreate extends CommonUserData {
    password: string
    role: Role;
    salt: string;
}
export interface UserSortParams {
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
}
