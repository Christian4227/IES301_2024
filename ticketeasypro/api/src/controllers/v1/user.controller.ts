import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"

import UserService from "../../services/user.service"
import { LoginResponseSchema, UserCreate, UserLogin } from "../../interfaces/user.interface";
import { verifyJwt } from "../../middlewares/JWTAuth";



const UserRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
    const userService: UserService = new UserService()

    api.post('/signin', async (request: FastifyRequest<{ Body: UserCreate }>, reply: FastifyReply) => {
        try {
            const data = await userService.create(request.body);
            return reply.send(data);
        } catch (error) {
            reply.send(error);
        }
    });

    api.post('/login', async (request: FastifyRequest<{ Body: UserLogin }>, reply: FastifyReply) => {
        try {

            const credentials = request.body;
            const data = await userService.login(credentials);
            const token = await reply.jwtSign({ login: data.email }, { sign: { sub: data.id, expiresIn: '12h' } });
            return { accessToken: token }

        } catch (error) {
            reply.send(error);
        }
    });

    api.get('/me', { onRequest: [verifyJwt] }, async (request: FastifyRequest, reply: FastifyReply) => {
        // Exibe dados do próprio usuário

        reply.send({ hello: 'aswosrld2' });
    });

    api.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        const all = await userService.getAll();
        return reply.status(200).send(all);
    })


    api.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const { id: userId } = request;
        try {
            await userService.deleteAccount(userId);
            return reply.status(204);
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            return reply.status(500).send({ message: 'Erro ao excluir usuário', error: 'Internal Server Error' });
        }
    });
}


export default UserRoute;