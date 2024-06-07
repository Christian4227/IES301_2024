import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import AccountService from "../../services/account.service";
// import { AccountRoleUpdate, AccountUpdateResult, PaginatedAccountResult, QueryPaginationFilter } from "../../interfaces/controller/account.interface";

import { Role } from "@prisma/client";
import { QueryPaginationFilter } from "@interfaces/common.interface";
// import { AccountResult } from "@interfaces/repository/account.interface";


const CategoryRoute: FastifyPluginAsync = async (api: FastifyInstance) => {

    // const accountService: AccountService = new AccountService();

    api.get<{ Querystring: QueryPaginationFilter }>(
        '/', async (request: FastifyRequest<{ Querystring: QueryPaginationFilter }>, reply: FastifyReply) => {
            // const { query: { filter, role, page = 1, pageSize = 10 } } = request;

            // if (role && !Object.values(Role).includes(role.toUpperCase() as Role)) {
            //     return reply.code(409).send({ "Error": "Invalid role provided." });
            // }
            // const response = await accountService.searchAccounts(filter, role?.toUpperCase(), page, pageSize);

            const response = {
                data: [
                    { id: 1, name: "Música", description: "Eventos relacionados a apresentações musicais e shows." },
                    { id: 2, name: "Esportes", description: "Eventos esportivos incluindo futebol, basquete, etc." },
                    { id: 3, name: "Tecnologia", description: "Conferências de tecnologia, hackathons e workshops." },
                    { id: 4, name: "Arte", description: "Exposições de arte, oficinas de pintura e mais." },
                    { id: 5, name: "Educação", description: "Eventos educacionais, seminários e palestras." },
                    { id: 6, name: "Gastronomia", description: "Festivais de comida, degustações e competições culinárias." },
                    { id: 7, name: "Moda", description: "Desfiles de moda, lançamentos de coleções e exposições de moda." },

                ],
                total: 7,
                totalPages: 1,
                currentPage: 1,
                pageSize: 10
            }
            return reply.code(200).send(response);
        });
}
export default CategoryRoute;