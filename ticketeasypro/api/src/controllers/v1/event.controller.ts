import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify"



const EventRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
    // Array simulado de eventos
    const events = [
        { id: 1, name: 'Evento 1' },
        { id: 2, name: 'Evento 2' },
        { id: 3, name: 'Evento 3' },
        { id: 4, name: 'Evento 4' },
        { id: 5, name: 'Evento 5' },
        // Adicione mais eventos conforme necessário
    ];

    api.get('/', {}, async (request: FastifyRequest, reply: FastifyReply) => {
        reply.code(200).send(events);

    })
}
export default EventRoute;