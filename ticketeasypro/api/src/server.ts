import dotenv from 'dotenv';
dotenv.config();

import fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fCookie from '@fastify/cookie';
import cors from "@fastify/cors";
import { initialData } from "./lifespan";
import Authentication, { AuthorizeRoles } from "./middlewares/JWTAuth";
import { FastifyInstance } from "./types/fastify";
import { WebhookRoute, TicketRoute, OrderRoute, EventRoute, VenueRoute, UserRoute, AccountRoute, CategoryRoute, TicketTypeRoute } from "./controllers/all_controllers";
import multipart from '@fastify/multipart'

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
api.register(multipart)
api.decorate('authenticate', Authentication)
api.decorate('authorizeRoles', AuthorizeRoles)

api.register(cors, { credentials: true, origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] });
api.register(EventRoute, { prefix: '/v1/events' });
api.register(UserRoute, { prefix: '/v1/users' });
api.register(AccountRoute, { prefix: '/v1/accounts' });
api.register(TicketTypeRoute, { prefix: '/v1/ticket-types' });
api.register(CategoryRoute, { prefix: '/v1/categories' });
api.register(OrderRoute, { prefix: '/v1/orders' });
api.register(WebhookRoute, { prefix: '/v1/webhook' });
api.register(VenueRoute, { prefix: '/v1/venues' });
api.register(TicketRoute, { prefix: '/v1/tickets' });


const start = async () => {

    api.ready(async err => {
        if (err) throw err;
        console.log("Todos os plugins foram carregados e o servidor está pronto.");
        await initialData();
    }
    )
    try {
        await api.listen({ port: Number(process.env.PORT_API ?? '3210'), host: process.env.HOST_API });
    } catch (err) {
        api.log.error(err);
        process.exit(1);
    }
}

start();
