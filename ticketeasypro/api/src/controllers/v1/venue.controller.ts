import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { PaginatedAccountResult, QueryPaginationFilter } from "../../interfaces/controller/account.interface";

import VenueService from "@services/venue.service";
// import { AccountResult } from "@interfaces/repository/account.interface";


const VenueRoute: FastifyPluginAsync = async (api: FastifyInstance) => {

    const venueService: VenueService = new VenueService();
    // api.post('/', { preHandler: [api.authenticate] },
    //     async (request: FastifyRequest<{ Body: AccountCreate }>, reply: FastifyReply) => {
    //         const { user: { role: actorRole }, body: updateData } = request;
    //         try {
    //             const account = await accountService.create(actorRole as Role, updateData, api);
    //             const { id, email, name, email_confirmed, birth_date, phone, phone_fix, role } = account;
    //             return reply.code(201).send({ id, email, name, email_confirmed, birth_date, phone, phone_fix, role });
    //         } catch (error) {
    //             return reply.code(409).send(error);
    //         }
    //     });

    // api.put('/:accountId/role',
    //     { preHandler: [api.authenticate] },
    //     async (request: FastifyRequest<{ Params: { accountId: string }, Body: AccountRoleUpdate }>,
    //         reply: FastifyReply): Promise<AccountUpdateResult> => {
    //         const { params: { accountId }, body: { role: actorRole } } = request;
    //         // console.log('aqui: ', accountId);
    //         try {
    //             const updateData = request.body;
    //             const resultUpdate = await accountService.update(actorRole, accountId, updateData);

    //             const { id, email, name, email_confirmed, birth_date, phone, phone_fix, role }: AccountUpdateResult = resultUpdate;
    //             return { id, email, name, email_confirmed, birth_date, phone, phone_fix, role };
    //         } catch (error) {
    //             return reply.code(401).send({ "Error": error });
    //         }
    //     });

    api.get('/:venueId',
        { preHandler: [api.authenticate] },
        async (request: FastifyRequest<{ Params: { venueId: number } }>, reply: FastifyReply) => {

            let venueId = request.params?.venueId;
            if (!venueId) return reply.code(200).send({ "Error": 'IdentifierMustNotBeEmpty' });
            // venueId = Number(venueId)
            try {
                const response = await venueService.getVenue(venueId);
                return reply.code(200).send(response);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    return reply.code(200).send(error);
                }
            };

        });


    // api.get<{ Querystring: { token: string } }>(
    //     '/confirm-email',
    //     async (request: FastifyRequest<{ Querystring: { token: string } }>, reply: FastifyReply): Promise<boolean> => {

    //         const confirmToken = request.query?.token;
    //         if (!confirmToken) return reply.code(200).send({ "Error": 'Token must not be empty.' });

    //         try {
    //             const response = await accountService.validateEmailConfirmationToken(confirmToken, api);
    //             return reply.code(200).send(!!response);
    //         } catch (error: unknown) {
    //             if (error instanceof Error) {
    //                 return reply.code(200).send(error);
    //             }
    //         };
    //         return reply.code(200).send(false);
    //     }
    // );

    // Endpoint para solicitação do email com link de redefeinição de senha
    // api.get<{ Params: { email: string } }>('/password-reset/:email',
    //     async (request: FastifyRequest<{ Params: { email: string } }>, reply: FastifyReply): Promise<boolean> => {
    //         const { email } = request.params as { email?: string };
    //         if (!email) return reply.code(400).send({ "Error": 'email must be not empty.' });

    //         try {
    //             await accountService.passwordReset(email, api);
    //             return reply.code(200).send({ "Success": true });
    //         } catch (error) {
    //             if (error instanceof Error)
    //                 if (error.message === "EmailNotFound") return reply.code(404).send({ "Success": false });
    //         }
    //         return reply.code(200).send({ "Success": true });
    //     });

    // api.post('/reset-password', async (request: FastifyRequest<{ Body: { token: string, newPassword: string } }>, reply: FastifyReply): Promise<boolean> => {
    //     const { token, newPassword } = request.body;
    //     try {
    //         await accountService.verifyResetToken(token, newPassword);
    //         return reply.code(200).send({ "Success": true });
    //     } catch (error) {
    //         if (error instanceof Error)
    //             if (error.message === "InvalidOrExpiredToken")
    //                 reply.status(400).send({ "Success": false });
    //     };
    //     return reply.code(200).send({ "Success": true });
    // });

    // api.get<{ Params: { email: string } }>('/resend-email-confirmation/:email',
    //     async (request: FastifyRequest<{ Params: { email: string } }>, reply: FastifyReply): Promise<boolean> => {
    //         // api.log.info('Resend email confirmation endpoint hit');
    //         const userEmail = request.params?.email;
    //         if (!userEmail) {

    //             return reply.code(400).send({ "Error": 'email must be not empty.' });
    //         }
    //         try {
    //             const user = await accountService.reSendConfirmationEmail(userEmail, api);
    //         } catch (error: unknown) {
    //             if (error instanceof Error)
    //                 return reply.code(200).send(error);//AccountNotFound

    //         }
    //         return reply.code(200).send({ "Success": true });

    //     });
    api.get<{ Querystring: QueryPaginationFilter }>(
        '/', { preHandler: [api.authenticate] },
        async (request: FastifyRequest<{ Querystring: QueryPaginationFilter }>, reply: FastifyReply): Promise<PaginatedAccountResult> => {
            // const { query: { filter, role, page = 1, pageSize = 10 } } = request;

            const response = await venueService.searchEvents({ page: 1, pageSize: 1000 }, [{ name: "asc" }]);
            return reply.code(200).send(response);
        });
}


export default VenueRoute;