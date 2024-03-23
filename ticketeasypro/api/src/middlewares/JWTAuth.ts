import { FastifyReply, FastifyRequest } from 'fastify';

const verifyJwt = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.status(401).send({ message: 'Send a correct token.' });
    }
}
export { verifyJwt }

