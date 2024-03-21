import fastify, { FastifyInstance } from "fastify";
import { UserRoute, EventRoute } from "./controllers/all_controllers";
import { fastifyJwt } from "@fastify/jwt";



const api: FastifyInstance = fastify({ logger: true });

(async () => {
    try {

        api.register(EventRoute, { prefix: '/v1/events' });
        api.register(UserRoute, { prefix: '/v1/users' });

    } catch (error) {
        console.error('Erro ao importar os controladores:', error);
    }

    const jwtSecreteKey: string = process.env.JWT_SECRET_KEY as string
    api.register(fastifyJwt, { secret: jwtSecreteKey });

    const listeners = ['SIGINT', 'SIGTERM'];
    listeners.forEach((signal) => {
        process.on(signal, async () => {
            await api.close();
            process.exit(0);
        })
    })
    api.listen({ port: 3333 }, () => { console.log('Server Subiu na porta 3333'); })


})();