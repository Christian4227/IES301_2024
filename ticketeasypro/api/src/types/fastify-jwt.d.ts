// fastify-jwt.d.ts

import { FastifyJWT } from '@fastify/jwt';
import UserPayload from './userPayload';

declare module '@fastify/jwt' {
    export interface FastifyJWT {
        user: UserPayload;
    }
}
export { FastifyJWT };