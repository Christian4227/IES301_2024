import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { PaginatedAccountResult, QueryPaginationFilter } from "../../interfaces/controller/account.interface";

import VenueService from "@services/venue.service";
// import { AccountResult } from "@interfaces/repository/account.interface";


const VenueRoute: FastifyPluginAsync = async (api: FastifyInstance) => {

    const venueService: VenueService = new VenueService();

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
            }

        });
        
    api.get<{ Querystring: QueryPaginationFilter }>(
        '/', { preHandler: [api.authenticate] },
        async (request: FastifyRequest<{ Querystring: QueryPaginationFilter }>, reply: FastifyReply): Promise<PaginatedAccountResult> => {
            // const { query: { filter, role, page = 1, pageSize = 10 } } = request;

            const response = await venueService.searchEvents({ page: 1, pageSize: 1000 }, [{ name: "asc" }]);
            return reply.code(200).send(response);
        });
}


export default VenueRoute;