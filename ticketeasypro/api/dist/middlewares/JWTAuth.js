"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
const verifyJwt = async (request, reply) => {
    try {
        await request.jwtVerify();
    }
    catch (err) {
        return reply.status(401).send({ message: 'Send a correct token.' });
    }
};
exports.verifyJwt = verifyJwt;
const Authentication = async (request, reply) => {
    try {
        const token = request.cookies.access_token;
        if (!token) {
            return reply.status(401).send({ message: 'Authentication required' });
        }
        // Verificar se o token é válido e decodificá-lo
        const decoded = request.jwt.verify(token);
        // Atribuir o usuário decodificado ao objeto request
        request.user = decoded;
        // Continuar com o fluxo da aplicação
        return;
    }
    catch (error) {
        console.error('Auth Error:', error);
        return reply.status(500).send({ message: 'Internal Server Error' });
    }
};
exports.default = Authentication;
