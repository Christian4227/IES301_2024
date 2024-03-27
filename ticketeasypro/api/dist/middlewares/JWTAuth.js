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
