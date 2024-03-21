import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"

import UserService from "../../services/user.service"
import { UserCreate } from "../../interfaces/user.interface";


const UserRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
    const userService: UserService = new UserService()

    api.post('/', async (request: FastifyRequest<{ Body: UserCreate }>, reply: FastifyReply) => {
        try {
            const data = await userService.create(request.body);
            return reply.send(data);
        } catch (error) {
            reply.send(error);
        }
    });

    api.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
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