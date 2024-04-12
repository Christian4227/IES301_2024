
import { FastifyInstance, FastifyRequest } from 'fastify';
import { JWT } from '@fastify/jwt';

declare module 'fastify' {
    interface FastifyRequest {
        jwt: JWT;
    }

    export interface FastifyInstance {
        authenticate: any;
    }
}

export { FastifyInstance };
