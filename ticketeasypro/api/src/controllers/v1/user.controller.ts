import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import UserService from "../../services/user.service";
import { UserCredentials, UserSignin, UserSigninResult, UserUpdate } from "@interfaces/controller/user.interface";
import { Token } from "@interfaces/token.interface";
import { generateConfirmationToken } from "@utils/auth";
import { Role } from "@prisma/client";


const UserRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
    const userService: UserService = new UserService();

    api.post('/signin', async (request: FastifyRequest<{ Body: UserSignin }>, reply: FastifyReply): Promise<UserSigninResult> => {
        try {
            const { body: userToSignin } = request;

            const requiredFields: (keyof UserSignin)[] = ['email', 'birth_date', 'password', 'confirm_password', 'name'];

            const allFields: (keyof UserSignin)[] = ['phone_fix', 'phone', ...requiredFields];

            // Check for missing required fields
            for (const field of requiredFields)
                if (!userToSignin[field]) return reply.code(409).send({ error: `Field ${field} is required` });

            // Verifica se birth_date é uma data válida
            const birthDate = new Date(userToSignin.birth_date);
            if (Number.isNaN(birthDate.getTime()))
                return reply.code(409).send({ error: 'Invalid birth_date' });

            // Create a valid payload by picking only the fields from the interface
            const validSigninPayload: Partial<UserSignin> = { birth_date: birthDate };
            for (const field of allFields) {
                const fieldValue = userToSignin[field] ?? false
                if (fieldValue)
                    if (field !== 'birth_date') validSigninPayload[field] = userToSignin[field];
            }

            // Create the user
            const user = await userService.create(validSigninPayload as UserSignin, Role.SPECTATOR, api);
            
            const { id, email, name, email_confirmed, birth_date, phone, phone_fix, role } = user

            return reply.code(201).send({ id, email, name, email_confirmed, birth_date, phone, phone_fix, role });
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