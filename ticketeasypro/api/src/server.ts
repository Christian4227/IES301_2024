import fastify, { FastifyRequest, FastifyReply } from "fastify";
import { UserRoute, EventRoute } from "./controllers/all_controllers";
import fastifyJwt from "@fastify/jwt";
import fCookie from '@fastify/cookie';
import cors from "@fastify/cors";
import Authentication from "./middlewares/JWTAuth";
import { FastifyInstance } from "./@types/fastify";
import { Role } from "@prisma/client";
import { UserCreate } from "./interfaces/user.interface";
import UserService from "./services/user.service";


const api: FastifyInstance = fastify({ logger: true });


const jwtSecreteKey: string = process.env.JWT_SECRET_KEY as string
api.register(fastifyJwt, { secret: jwtSecreteKey });

// cookies
api.register(fCookie, {
    secret: process.env.COOKIE_SECRET_KEY,
    hook: 'preHandler',
})

api.addHook('preHandler', (request: FastifyRequest, reply: FastifyReply, next) => {

    request.jwt = api.jwt
    return next()
})

api.decorate('authenticate', Authentication)

api.register(cors, { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] });
api.register(EventRoute, { prefix: '/v1/events' });
api.register(UserRoute, { prefix: '/v1/users' });


const initialData = async () => {
    try {


        const userData = <UserCreate>{
            email: "root@ticketeasypro.com.br",
            password: "fatec123#1sem.2024",
            email_confirmed: true,
            birth_date: new Date("1992-07-08"), // Use o formato AAAA-MM-DD
            name: "root",
            phone: "9999-2021",
            salt: "9876543210",
            role: Role.ADMIN
        };
        const userService = new UserService()
        const user = await userService.find(userData.email)

        let userCreated;

        if (!user) {
            userCreated = await userService.create(userData);
        }
        else {
            userService.deleteAccount(user.id);
            userCreated = await userService.create(userData);
        }



        // const user = await create(userData);

        console.log('Usuário criado:', userCreated);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
    }
}

const start = async () => {

    api.ready(async err => {
        if (err) throw err;
        console.log("Todos os plugins foram carregados e o servidor está pronto.");
        await initialData();
    }
    )



    try {
        await api.listen({ port: 3210, host: '0.0.0.0' });
    } catch (err) {
        api.log.error(err);
        process.exit(1);
    }
}

start();
