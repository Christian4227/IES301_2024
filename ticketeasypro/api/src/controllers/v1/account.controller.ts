import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import AccountService from "../../services/account.service";
import { AccountRoleUpdate, AccountUpdateResult, PaginatedAccountResult, QueryPaginationFilter } from "../../interfaces/controller/account.interface";
import { AccountCreate } from "@interfaces/service/account.interface";
import { Role } from "@prisma/client";
import { Identifier } from "types/common.type";


const AccountRoute: FastifyPluginAsync = async (api: FastifyInstance) => {

    const accountService: AccountService = new AccountService();
    api.post('/', { preHandler: [api.authenticate] },
        async (request: FastifyRequest<{ Body: AccountCreate }>, reply: FastifyReply) => {
            const { user: { role: actorRole }, body: updateData } = request;
            try {
                const account = await accountService.create(actorRole as Role, updateData, api);
                const { id, email, name, email_confirmed, birth_date, phone, phone_fix, role } = account;                
                return reply.code(201).send({ id, email, name, email_confirmed, birth_date, phone, phone_fix, role });
            } catch (error) {
                return reply.code(409).send(error);
            }
        });

    api.put('/:accountId/role',
        { preHandler: [api.authenticate] },
        async (request: FastifyRequest<{ Params: { accountId: string }, Body: AccountRoleUpdate }>,
            reply: FastifyReply): Promise<AccountUpdateResult> => {
            const { params: { accountId }, body: { role: actorRole } } = request;
            // console.log('aqui: ', accountId);
            try {
                const updateData = request.body;
                const resultUpdate = await accountService.update(actorRole, accountId, updateData);

                const { id, email, name, email_confirmed, birth_date, phone, phone_fix, role }: AccountUpdateResult = resultUpdate;
                return { id, email, name, email_confirmed, birth_date, phone, phone_fix, role };
            } catch (error) {
                return reply.code(401).send({ "Error": error });
            }
        });

    api.get('/:accountId',
        { preHandler: [api.authenticate] },
        async (request: FastifyRequest<{ Params: { accountId: string } }>, reply: FastifyReply) => {

            const accountId = request.params?.accountId;
            if (!accountId) return reply.code(200).send({ "Error": 'IdentifierMustNotBeEmpty' });

            try {
                const response = await accountService.getOne({ id: accountId } as Identifier);
                return reply.code(200).send(response);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    return reply.code(200).send(error);
                }
            }

        });


    api.get<{ Querystring: { token: string } }>(
        '/confirm-email',
        async (request: FastifyRequest<{ Querystring: { token: string } }>, reply: FastifyReply): Promise<boolean> => {

            const confirmToken = request.query?.token;
            if (!confirmToken) return reply.code(200).send({ "Error": 'Token must not be empty.' });

            try {
                const response = await accountService.validateEmailConfirmationToken(confirmToken, api);
                return reply.code(200).send(!!response);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    return reply.code(200).send(error);
                }
            }
            return reply.code(200).send(false);
        }
    );

    // Endpoint para solicitação do email com link de redefeinição de senha
    api.get<{ Params: { email: string } }>('/password-reset/:email',
        async (request: FastifyRequest<{ Params: { email: string } }>, reply: FastifyReply): Promise<boolean> => {
            const { email } = request.params as { email?: string };
            if (!email) return reply.code(400).send({ "Error": 'email must be not empty.' });

            try {
                await accountService.passwordReset(email, api);
                return reply.code(200).send({ "Success": true });
            } catch (error) {
                if (error instanceof Error)
                    if (error.message === "EmailNotFound") return reply.code(404).send({ "Success": false });
            }
            return reply.code(200).send({ "Success": true });
        });

    api.post('/reset-password', async (request: FastifyRequest<{ Body: { token: string, newPassword: string } }>, reply: FastifyReply): Promise<boolean> => {
        const { token, newPassword } = request.body;
        try {
            await accountService.verifyResetToken(token, newPassword);
            return reply.code(200).send({ "Success": true });
        } catch (error) {
            if (error instanceof Error)
                if (error.message === "InvalidOrExpiredToken")
                    return reply.status(400).send({ "Success": false });
        }
        return reply.code(500).send({ "Success": false });
    });

    api.get<{ Params: { email: string } }>('/resend-email-confirmation/:email',
        async (request: FastifyRequest<{ Params: { email: string } }>, reply: FastifyReply): Promise<boolean> => {
            // api.log.info('Resend email confirmation endpoint hit');
            const userEmail = request.params?.email;
            if (!userEmail) {

                return reply.code(400).send({ "Error": 'email must be not empty.' });
            }
            try {
                const user = await accountService.reSendConfirmationEmail(userEmail, api);
            } catch (error: unknown) {
                if (error instanceof Error)
                    return reply.code(200).send(error);//AccountNotFound

            }
            return reply.code(200).send({ "Success": true });

        });
    api.get<{ Querystring: QueryPaginationFilter }>(
        '/', { preHandler: [api.authenticate] },
        async (request: FastifyRequest<{ Querystring: QueryPaginationFilter }>, reply: FastifyReply): Promise<PaginatedAccountResult> => {
            const { query: { filter, role, page = 1, pageSize = 10 } } = request;

            if (role && !Object.values(Role).includes(role.toUpperCase() as Role)) {
                return reply.code(409).send({ "Error": "Invalid role provided." });
            }
            const response = await accountService.searchAccounts(filter, role?.toUpperCase(), page, pageSize);
            return reply.code(200).send(response);
        });
}


export default AccountRoute;