import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"

import UserService from "../../services/user.service"
import { UserCreate, UserCredentials, } from "../../interfaces/user.interface";
import { verifyJwt } from "../../middlewares/JWTAuth";
import { Token } from "../../interfaces/token.interface";


// interface TokenResponse {
//     accessToken: string; // Ou o tipo adequado para o token JWT
// }


const UserRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
    const userService: UserService = new UserService()

    api.post('/signin', async (request: FastifyRequest<{ Body: UserCreate }>, reply: FastifyReply) => {
        try {
            const data = await userService.create(request.body);
            console.log("entrou");

            return reply.send(data);
        } catch (error) {
            reply.send(error);
        }
    });

    api.post('/login', async (request: FastifyRequest<{ Body: UserCredentials }>, reply: FastifyReply): Promise<Token> => {
        try {

            const credentials = request.body;

            const token = await userService.generateCookie(credentials, reply.jwtSign.bind(reply), reply.setCookie.bind(reply));

            return reply.code(200).send({ accessToken: token });

        } catch (error) {
            return reply.code(401).send(error);
        }
    });

    api.get('/me', { preHandler: [api.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
        // Exibe dados do próprio usuário

        reply.send({ hello: request.user });
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
            console.error('User deletion error:', error);
            return reply.status(500).send({ message: 'User deletion error', error: 'Internal Server Error' });
        }
    });
}


export default UserRoute;