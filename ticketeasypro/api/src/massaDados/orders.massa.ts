import { PrismaClient, OrderStatus, PaymentMethod, TicketStatus, Role } from '@prisma/client';

const prisma = new PrismaClient();

interface OrderTicketInput {
    typeId: number;
    quantity: number;
}

async function createRandomOrders() {
    try {
        // 1. Buscar todos os usuários do tipo "SPECTATOR"
        const spectators = await prisma.user.findMany({
            where: { role: Role.SPECTATOR },
        });

        // 2. Buscar todos os eventos e tipos de tickets
        const events = await prisma.event.findMany();
        const ticketTypes = await prisma.ticketType.findMany();

        if (events.length === 0) {
            console.log('Nenhum evento encontrado.');
            return;
        }

        // 3. Para cada usuário, criar ordens de compra para 2 até 7 eventos diferentes
        for (const user of spectators) {
            const eventsToPurchase = getRandomEvents(events, 2, 7);

            for (const event of eventsToPurchase) {
                // Criar tickets aleatórios
                const orderTickets: OrderTicketInput[] = [
                    {
                        typeId: ticketTypes[Math.floor(Math.random() * ticketTypes.length)].id,
                        quantity: Math.floor(Math.random() * 5) + 1 // Quantidade aleatória entre 1 e 5
                    }
                ];

                // Criar a ordem de compra
                await createOrder(user.id, event.id, PaymentMethod.PIX, orderTickets);
            }
        }

        console.log('Ordens de compra criadas com sucesso.');
    } catch (error) {
        console.error('Erro ao criar ordens de compra:', error);
    } finally {
        await prisma.$disconnect();
    }
}

function getRandomEvents(events: any[], min: number, max: number) {
    const shuffled = events.sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    return shuffled.slice(0, count);
}

async function createOrder(
    customerId: string,
    eventId: number,
    paymentMethod: PaymentMethod,
    orderTickets: OrderTicketInput[]
) {
    // Buscar informações do evento
    const event = await prisma.event.findUniqueOrThrow({
        where: { id: eventId },
        select: { base_price: true, capacity: true, id: true },
    });

    // Buscar tipos de tickets
    const typeIds = orderTickets.map(orderTicket => orderTicket.typeId);
    const typesTicket = await prisma.ticketType.findMany({
        where: { id: { in: typeIds } },
        select: { id: true, discount: true }
    });

    // Adicionar desconto ao objeto orderTickets
    const orderTicketsWithDiscount = orderTickets.map(orderTicket => {
        const ticketType = typesTicket.find(type => type.id === orderTicket.typeId);
        return { ...orderTicket, discount: ticketType ? ticketType.discount : 0 };
    });

    // Calcular o valor total da ordem
    const totalAmount = orderTicketsWithDiscount.reduce((acc, orderTicket) => {
        const unitaryPrice = Math.round(event.base_price * (1 - orderTicket.discount / 100));
        return acc + (unitaryPrice * orderTicket.quantity);
    }, 0); // Em centavos

    try {
        const result = await prisma.$transaction(async (transaction) => {
            // Criar a ordem de compra (Order)
            const order = await transaction.order.create({
                data: {
                    event_id: event.id,
                    payment_method: paymentMethod,
                    customer_id: customerId,
                    total_amount: totalAmount,
                    status: OrderStatus.PROCESSING
                }
            });

            // Criar tickets e itens da ordem de compra (OrderTicket)
            const ticketPromises = orderTicketsWithDiscount.flatMap(orderTicket => {
                return Array(orderTicket.quantity).fill(null).map(async () => {
                    // Criar o Ticket
                    const ticket = await transaction.ticket.create({
                        data: {
                            event_id: event.id,
                            status: TicketStatus.RESERVED
                        },
                    });

                    // Criar o OrderTicket
                    return transaction.orderTicket.create({
                        data: {
                            order_id: order.id,
                            ticket_id: ticket.id,
                            unit_price: event.base_price, // Em centavos
                            ticketTypeId: orderTicket.typeId
                        },
                    });
                });
            });

            await Promise.all(ticketPromises);

            return { order };
        });

        return result;
    } catch (error) {
        console.error('Erro ao criar Order com OrderTickets e Tickets:', error);
        throw error;
    }
}

// Função para criar ordens de compra aleatórias
export default createRandomOrders;
