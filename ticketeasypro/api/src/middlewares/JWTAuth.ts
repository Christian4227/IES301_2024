// import { FastifyJWT } from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
// import UserPayload from "../@types/userPayload";
import { FastifyJWT } from "../@types/fastify-jwt";


const verifyJwt = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.status(401).send({ message: 'Send a correct token.' });
    }
}

const Authentication = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = request.cookies.access_token;
        if (!token) {
            return reply.status(401).send({ message: 'Authentication required' });
        }

        // Verificar se o token é válido e decodificá-lo
        const decoded = request.jwt.verify<FastifyJWT['user']>(token);

        // Atribuir o usuário decodificado ao objeto request
        request.user = decoded;

        // Continuar com o fluxo da aplicação
        return;
    } catch (error) {
        console.error('Auth Error:', error);
        return reply.status(500).send({ message: 'Internal Server Error' });
    }
}

export default Authentication;
export { verifyJwt }

