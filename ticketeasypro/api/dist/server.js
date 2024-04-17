"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const all_controllers_1 = require("./controllers/all_controllers");
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const cors_1 = __importDefault(require("@fastify/cors"));
const JWTAuth_1 = __importDefault(require("./middlewares/JWTAuth"));
const api = (0, fastify_1.default)({ logger: true });
const jwtSecreteKey = process.env.JWT_SECRET_KEY;
api.register(jwt_1.default, { secret: jwtSecreteKey });
// cookies
api.register(cookie_1.default, {
    secret: process.env.COOKIE_SECRET_KEY,
    hook: 'preHandler',
});
api.addHook('preHandler', (request, reply, next) => {
    request.jwt = api.jwt;
    return next();
});
api.decorate('authenticate', JWTAuth_1.default);
api.register(cors_1.default, { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] });
api.register(all_controllers_1.EventRoute, { prefix: '/v1/events' });
api.register(all_controllers_1.UserRoute, { prefix: '/v1/users' });
const start = async () => {
    try {
        await api.listen({ port: 3210, host: '0.0.0.0' });
    }
    catch (err) {
        api.log.error(err);
        process.exit(1);
    }
};
start();
