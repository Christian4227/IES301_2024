import fastify, { FastifyRequest, FastifyReply } from "fastify";
import { UserRoute, EventRoute } from "./controllers/all_controllers";
import fastifyJwt from "@fastify/jwt";
import fCookie from '@fastify/cookie';
import cors from "@fastify/cors";
import Authentication from "./middlewares/JWTAuth";
import { FastifyInstance } from "./@types/fastify";

const api: FastifyInstance = fastify({ logger: true });


const jwtSecreteKey: string = process.env.JWT_SECRET_KEY as string
api.register(fastifyJwt, { secret: jwtSecreteKey });

// cookies
api.register(fCookie, {
    secret: process.env.COOKIE_SECRET_KEY,
    hook: 'preHandler',
})

api.addHook('preHandler', (request: FastifyRequest, reply: FastifyReply, next) => {

    request.jwt = api.jwt
    return next()
})

api.decorate('authenticate', Authentication)

api.register(cors, { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] });
api.register(EventRoute, { prefix: '/v1/events' });
api.register(UserRoute, { prefix: '/v1/users' });

const start = async () => {
    try {
        await api.listen({ port: 3210, host: '0.0.0.0' });
    } catch (err) {
        api.log.error(err);
        process.exit(1);
    }
}

start();
