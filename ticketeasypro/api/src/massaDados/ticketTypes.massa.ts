import { PrismaClient } from '@prisma/client';

const ticketTypes = [
    {
        "name": "Ingresso Comum",
        "discount": 0,
        "description": "Ingresso regular sem desconto."
    },
    {
        "name": "Meia-Entrada para Estudantes",
        "discount": 50,
        "description": "Ingresso com desconto para estudantes."
    },
    {
        "name": "Ingresso VIP",
        "discount": 20,
        "description": "Ingresso VIP com benefícios adicionais."
    },
    {
        "name": "Meia-Entrada para Idosos",
        "discount": 30,
        "description": "Ingresso com desconto para idosos."
    },
    {
        "name": "Especial",
        "discount": 15,
        "description": "Ingresso com desconto especial."
    }
]

const createTicketTypes = async (prisma: PrismaClient) => {

    const storedTicketTypesCount = await prisma.ticketType.count();
    try {
        if (storedTicketTypesCount <= ticketTypes.length) {
            await prisma.ticketType.createMany({
                data: ticketTypes
            });
        }
        console.log("Tipos de Ticket criados com sucesso!");
    } catch (error) {
        console.error("Erro ao criar Tipos de Ticket:", error);
    };
};

export default createTicketTypes;