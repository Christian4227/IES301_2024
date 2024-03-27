"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const all_controllers_1 = require("./controllers/all_controllers");
const jwt_1 = __importDefault(require("@fastify/jwt"));
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
const api = (0, fastify_1.default)({ logger: true });
(async () => {
    try {
        api.register(all_controllers_1.EventRoute, { prefix: '/v1/events' });
        api.register(all_controllers_1.UserRoute, { prefix: '/v1/users' });
    }
    catch (error) {
        console.error('Erro ao importar os controladores:', error);
    }
    const jwtSecreteKey = process.env.JWT_SECRET_KEY;
    // api.register(fastifyJwt, { secret: jwtSecreteKey });
    api.register(jwt_1.default, { secret: jwtSecreteKey });
    // api.jwt.verify
    // api.decorate("authenticate", verifyJwt);
    // api.addHook("preHandler", (request: FastifyRequest, reply: FastifyReply, next) => {
    // request.jwt = api.jwt;
    // return next();
    // });
    const listeners = ['SIGINT', 'SIGTERM'];
    listeners.forEach((signal) => {
        process.on(signal, async () => {
            await api.close();
            process.exit(0);
        });
    });
    api.listen({ port: 3210 }, () => { console.log('Server Subiu na porta 3210'); });
})();
