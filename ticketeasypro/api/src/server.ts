import fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fCookie from '@fastify/cookie';
import cors from "@fastify/cors";
import { initialData } from "./lifespan";
import Authentication, { AuthorizeRoles } from "./middlewares/JWTAuth";
import { FastifyInstance } from "./types/fastify";
import { EventRoute, UserRoute, AccountRoute, TicketTypeRoute } from "./controllers/all_controllers";


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
api.decorate('authorizeRoles', AuthorizeRoles)

api.register(cors, { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] });
api.register(EventRoute, { prefix: '/v1/events' });
api.register(UserRoute, { prefix: '/v1/users' });
api.register(AccountRoute, { prefix: '/v1/accounts' });
api.register(TicketTypeRoute, { prefix: '/v1/ticket-types' });


const start = async () => {

    api.ready(async err => {
        if (err) throw err;
        console.log("Todos os plugins foram carregados e o servidor está pronto.");
        await initialData();
    }
    )
    try {
        await api.listen({ port: 3210, host: '0.0.0.0' });
    } catch (err) {
        api.log.error(err);
        process.exit(1);
    }
}

start();
