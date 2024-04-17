"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../../services/user.service"));
// interface TokenResponse {
//     accessToken: string; // Ou o tipo adequado para o token JWT
// }
const UserRoute = async (api) => {
    const userService = new user_service_1.default();
    api.post('/signin', async (request, reply) => {
        try {
            const data = await userService.create(request.body);
            console.log("entrou");
            return reply.send(data);
        }
        catch (error) {
            reply.send(error);
        }
    });
    api.post('/login', async (request, reply) => {
        try {
            const credentials = request.body;
            const token = await userService.generateCookie(credentials, reply.jwtSign.bind(reply), reply.setCookie.bind(reply));
            return reply.code(200).send({ accessToken: token });
        }
        catch (error) {
            return reply.code(401).send(error);
        }
    });
    api.get('/me', { preHandler: [api.authenticate] }, async (request, reply) => {
        // Exibe dados do próprio usuário
        reply.send({ hello: request.user });
    });
    api.get('/', async (request, reply) => {
        const all = await userService.getAll();
        return reply.status(200).send(all);
    });
    api.delete('/:id', async (request, reply) => {
        const { id: userId } = request;
        try {
            await userService.deleteAccount(userId);
            return reply.status(204);
        }
        catch (error) {
            console.error('User deletion error:', error);
            return reply.status(500).send({ message: 'User deletion error', error: 'Internal Server Error' });
        }
    });
};
exports.default = UserRoute;
