import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify"

import EmailService from "../../services/email.service";
import { Email } from "../../interfaces/email.interface";


const EmailRoute: FastifyPluginAsync = async (api: FastifyInstance) => {
    const emailService: EmailService = new EmailService();

    api.post('/send-email', async (request: FastifyRequest<{ Body: Email }>, reply: FastifyReply) => {
        try {
            const result = await emailService.send(request.body);
            reply.send(result);
        } catch (error: unknown) {
            reply.status(500).send({ success: false, error: (error as Error).message });
        }
    });
}

export default EmailRoute;