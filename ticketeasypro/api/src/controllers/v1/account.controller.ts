import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import AccountService from "../../services/accounts.service";
import { AccountCreate, AccountRoleUpdate, AccountUpdateResult, PaginatedAccountResult, QueryPaginationFilter } from "../../interfaces/controller/account.interface";
import { Role } from "@prisma/client";



const AccountRoute: FastifyPluginAsync = async (api: FastifyInstance) => {

    const accountService: AccountService = new AccountService();

    api.post('/', { preHandler: [api.authenticate] },
        async (request: FastifyRequest<{ Body: AccountCreate }>, reply: FastifyReply) => {
            const { user: { role: actorRole }, body: updateData } = request;
            try {
                const data = await accountService.create(actorRole as Role, updateData);
                return reply.code(201).send(data);
            } catch (error) {
                reply.send(error);
            }
        });

    api.put('/:accountId/role',
        { preHandler: [api.authenticate] },
        async (request: FastifyRequest<{ Params: { accountId: string }, Body: AccountRoleUpdate }>,
            reply: FastifyReply): Promise<AccountUpdateResult> => {
            const { params: { accountId }, body: { role: actorRole } } = request;
            console.log('aqui: ', accountId);
            try {
                const updateData = request.body;
                const resultUpdate = await accountService.update(actorRole, accountId, updateData);

                const { id, email, name, email_confirmed, birth_date, phone, phone_fix, role }: AccountUpdateResult = resultUpdate;
                return { id, email, name, email_confirmed, birth_date, phone, phone_fix, role };
            } catch (error) {
                return reply.code(401).send(error);
            }
        });

    api.get('/whoami', { preHandler: [api.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
        reply.send({ hello: request.user });
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
// api.put('/:accountId', { preHandler: [api.authenticate] }, async (request: FastifyRequest<{ Params: { userId: string }, Body: UserUpdate }>, reply: FastifyReply) => {
//     const { user: { id: userId }, body: updateData } = request;
//     const { params: { userId }, body: { role } } = request;

//     try {
//         await userService.update({ id: userId }, updateData);
//         return reply.status(204);
//     } catch (error) {
//         console.error('User update error:', error);
//         return reply.status(500).send({ message: 'User update error', error: 'Internal Server Error' });
//     }
// });


export default AccountRoute;