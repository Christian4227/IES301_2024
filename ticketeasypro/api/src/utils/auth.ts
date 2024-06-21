import { Role } from "@prisma/client";
import { FastifyInstance } from "./../types/fastify";

type userToConfirmToken = {
    id: string;
    email: string
}
export const generateConfirmationToken = async (user: userToConfirmToken, api: FastifyInstance) => {
    return api.jwt.sign({ email: user.email, sub: user.id }, { expiresIn: '15m' });
};

export const AnyRole = [Role.ADMIN, Role.EVENT_MANAGER, Role.SPECTATOR, Role.STAFF]