import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import UserService from "../../services/user.service";
import { UserCredentials, UserSignin, UserSigninResult, UserUpdate } from "@interfaces/controller/user.interface";
import { Token } from "@interfaces/token.interface";
import { generateConfirmationToken } from "@utils/auth";


const UserRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
    const userService: UserService = new UserService();

    api.post('/signin', async (request: FastifyRequest<{ Body: UserSignin }>, reply: FastifyReply): Promise<UserSigninResult> => {
        try {
            const user = await userService.create(request.body);
            const { email, id } = user;
            const tokenConfirmation = await generateConfirmationToken({ email, id }, api)
            return reply.code(201).send(user);
        } catch (error) {
            return reply.code(409).send(error);
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

    api.get('/whoami', { preHandler: [api.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
        reply.send({ hello: request.user });
    });

    // O user pode alterar os dados dele mesmo apenas
    api.put('/', { preHandler: [api.authenticate] }, async (request: FastifyRequest<{ Body: UserUpdate }>, reply: FastifyReply) => {

        const { user: { sub: userId }, body: updateData } = request;
        try {
            await userService.update({ id: userId }, updateData);
            return reply.status(204);
        } catch (error) {
            console.error('User update error:', error);
            return reply.status(500).send({ message: 'User update error', error: 'Internal Server Error' });
        }
    });
}


export default UserRoute;