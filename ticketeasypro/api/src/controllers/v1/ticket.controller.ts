import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

import prisma from "./../../repositories/prisma"

import { integerRegex } from "@utils/validators";
import { Role, TicketStatus } from "@prisma/client";

const TicketRoute: FastifyPluginAsync = async (api: FastifyInstance) => {

	// Retorna a quantidade de Ticket já compromissados para um evento
	api.get('/:eventId',
		{ preHandler: [api.authenticate] },
		async (request: FastifyRequest<{ Params: { eventId: number } }>, reply: FastifyReply): Promise<number> => {
			let { params: { eventId } } = request;
			if (!integerRegex.test(eventId.toString()))
				return reply.code(400).send({ message: 'EventIdMustBeValidValue' });

			eventId = Number(eventId)
			const [event, ticketCount] = await prisma.$transaction(async (transaction) => {
				const event = await transaction.event.findUnique({
					where: { id: eventId },
					select: { capacity: true },
				});

				const ticketCount = await transaction.ticket.count({
					where: {
						event_id: eventId,
						status: {
							in: [TicketStatus.AVAILABLE, TicketStatus.RESERVED],
						},
					},
				});

				return [event, ticketCount];
			});
			const capacity = event?.capacity ?? 0
			const quantityFreeTickets = capacity - ticketCount
			return reply.code(200).send(quantityFreeTickets);
		}
	);
	// Ednpoint para verificar se o ticket está apto para permitir entrada no evento
	api.get('/:ticketId/checkin', { preHandler: [api.authenticate, api.authorizeRoles(Role.STAFF)] },
		async (request: FastifyRequest<{ Params: { ticketId: string } }>, reply: FastifyReply) => {
			let { params: { ticketId } } = request;

			const [ticket, ticketUpdated] = await prisma.$transaction(async (transaction) => {
				// Busca o ticket pelo ID
				const ticket = await transaction.ticket.findUnique({ where: { id: ticketId } });

				if (!ticket) return [null, null];

				// Verificações de status do ticket
				switch (ticket.status) {
					case TicketStatus.USED:
						return [ticket, null]; // Ticket já foi usado
					case TicketStatus.CANCELLED:
						return [ticket, null]; // Ticket cancelado
					case TicketStatus.EXPIRED:
						return [ticket, null]; // Ticket expirado
					case TicketStatus.AVAILABLE:
					case TicketStatus.RESERVED:
						// Atualiza o ticket para marcá-lo como usado
						const updatedTicket = await transaction.ticket.update({
							where: { id: ticket.id },
							data: { status: TicketStatus.USED },
						});
						return [ticket, updatedTicket];
					default:
						return [null, null]; // Status desconhecido (não deve acontecer)
				}
			});

			// Tratamento de respostas com base no status do ticket
			if (!ticket && !ticketUpdated) {
				return reply.code(404).send("TicketNotFound");
			}

			switch (ticket?.status) {
				case TicketStatus.USED:
					return reply.code(200).send({ "fail": "TicketHasBeenUsed" });
				case TicketStatus.CANCELLED:
					return reply.code(200).send({ "fail": "TicketCancelled" });
				case TicketStatus.EXPIRED:
					return reply.code(200).send({ "fail": "TicketExpired" });
				case TicketStatus.AVAILABLE:
					return reply.code(200).send({ "success": ticketUpdated?.id });
				case TicketStatus.RESERVED:
					return reply.code(200).send("TicketReservedPendingPayment"); // Pode ser necessário ajuste conforme lógica específica
				default:
					return reply.code(500).send({ "fail": "UnexpectedTicketStatus" }); // Status inesperado (não deve acontecer)
			}
		});


}
export default TicketRoute;