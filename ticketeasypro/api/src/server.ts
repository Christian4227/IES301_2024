import fastify, { FastifyRequest, FastifyInstance, FastifyReply, RouteShorthandOptions } from "fastify";
import { UserRoute, EventRoute } from "./controllers/all_controllers";
import fastifyJwt, { JWT } from "@fastify/jwt";
// import { verifyJwt } from "./middlewares/JWTAuth";
import cors from "@fastify/cors";

// declare module "fastify" {
//     interface FastifyRequest {
//         jwt: JWT;
//     }
//     export interface FastifyInstance {
//         authenticate: any;
//     }
// }

// declare module "@fastify/jwt" {
//     interface FastifyJWT {
//         user: {
//             id: string;
//             email: string;
//             name: string;
//         };
//     }
// }


const api: FastifyInstance = fastify({ logger: true });
api.register(cors, { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] });
api.register(EventRoute, { prefix: '/v1/events' });
api.register(UserRoute, { prefix: '/v1/users' });

const jwtSecreteKey: string = process.env.JWT_SECRET_KEY as string
api.register(fastifyJwt, { secret: jwtSecreteKey });

const start = async () => {
    try {
        await api.listen({ port: 3210 });
        const address = api.server.address();
        const port = typeof address === 'string' ? address : address?.port;

    } catch (err) {
        api.log.error(err);
        process.exit(1);
    }
}

start()


// const start = async (api: FastifyInstance) => {

//     try {
//         api.register(EventRoute, { prefix: '/v1/events' });
//         api.register(UserRoute, { prefix: '/v1/users' });
//         api.register(cors, {
//             origin: '*',
//             methods: ['GET', 'POST', 'PUT', 'DELETE']
//         })

//     } catch (error) {
//         console.error('Erro ao importar os controladores:', error);
//     }

//     const jwtSecreteKey: string = process.env.JWT_SECRET_KEY as string
//     // api.register(fastifyJwt, { secret: jwtSecreteKey });

//     api.register(fastifyJwt, { secret: jwtSecreteKey });
//     // api.jwt.verify

//     // api.decorate("authenticate", verifyJwt);


//     // api.addHook("preHandler", (request: FastifyRequest, reply: FastifyReply, next) => {
//     // request.jwt = api.jwt;
//     // return next();
//     // });

//     // const listeners = ['SIGINT', 'SIGTERM'];
//     // listeners.forEach((signal) => {
//     // process.on(signal, async () => {
//     // await api.close();
//     // process.exit(0);
//     // })
//     // }
//     // )
//     //
//     api.listen({ port: 3210 }, () => { console.log('Server Subiu na porta 3210'); });

// }

// const api: FastifyInstance = fastify({ logger: true });
// start(api);