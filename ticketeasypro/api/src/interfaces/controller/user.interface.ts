import { CookieSerializeOptions } from "@fastify/cookie";
import { FastifyJwtSignOptions, SignPayloadType } from "@fastify/jwt";
import { FastifyReply } from "fastify";


export interface UserSignin {
    email: string;
    name: string;
    birth_date: Date;
    phone: string;
    phone_fix?: string;
    password: string;
    confirm_password: string
}

export interface UserSigninResult {
    id: string;
    email: string;
    name: string;
    emailConfirmed?: boolean;
    birth_date: Date;
    phone?: string;
    phone_fix?: string;
    role: string;
}



export interface UserUpdate {
    name?: string;
    birth_date?: Date;
    phone?: string;
    phone_fix?: string;
};



export interface UserCredentials {
    email: string;
    password: string

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
