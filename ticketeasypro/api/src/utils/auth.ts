import { FastifyInstance } from "./../types/fastify";

type userToConfirmToken = {
    id: string;
    email: string
}
export const generateConfirmationToken = async (user: userToConfirmToken, api: FastifyInstance) => {
    return api.jwt.sign({ email: user.email, sub: user.id }, { expiresIn: '15m' });
};