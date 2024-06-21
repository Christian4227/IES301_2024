import { EventStatus, PrismaClient, Role } from "@prisma/client";
import prisma from "./repositories/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import uuid4 from "uuid4";
import createRandomOrders from "./massaDados/orders.massa";
import createusers from "./massaDados/users.massa";
import createTicketTypes from "./massaDados/ticketTypes.massa";


// Função para obter um número aleatório entre dois valores
const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para obter uma data aleatória entre hoje e dois meses no futuro
const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Função para adicionar dias a uma data
const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Função para criar 15 eventos aleatórios
const createRandomEvents = async () => {
    const today = new Date();
    const twoMonthsLater = addDays(today, Math.max(Math.random() * 90, Math.random() * 150)); // Adicionar 60 dias à data atual

    // Obter todos os gerentes, categorias e locais
    const managers = await prisma.user.findMany({
        where: {
            role: Role.EVENT_MANAGER
        }
    });

    const categories = await prisma.category.findMany();
    const venues = await prisma.venue.findMany();

    if (managers.length === 0) {
        console.log("Nenhum gerente encontrado.");
        return;
    }

    if (categories.length === 0) {
        console.log("Nenhuma categoria encontrada.");
        return;
    }

    if (venues.length === 0) {
        console.log("Nenhum local encontrado.");
        return;
    }

    const eventNames = [
        "Concert Rock",
        "Tech Conference",
        "Football Match",
        "Art Exhibition",
        "Food Festival",
        "Fashion Show",
        "Marathon",
        "Music Festival",
        "Dance Performance",
        "Film Premiere",
        "Jazz Night",
        "Startup Pitch",
        "Yoga Retreat",
        "Book Fair",
        "Comedy Show"
    ];

    const events = [];

    for (let i = 0; i < 15; i++) {
        const randomManager = managers[getRandomInt(0, managers.length - 1)];
        const randomCategory = categories[getRandomInt(0, categories.length - 1)];
        const randomVenue = venues[getRandomInt(0, venues.length - 1)];
        const randomEventName = eventNames[getRandomInt(0, eventNames.length - 1)];
        const initialDate = getRandomDate(today, twoMonthsLater);
        const finalDate = getRandomDate(initialDate, addDays(initialDate, 1)); // Durando até 1 dia

        events.push({
            manager_id: randomManager.id,
            name: randomEventName,
            description: `${randomEventName} description.`,
            initial_date: initialDate,
            final_date: finalDate,
            category_id: randomCategory.id,
            status: EventStatus.PLANNED,
            base_price: getRandomInt(50, 500), // Preço base entre 50 e 500
            capacity: getRandomInt(100, 10000), // Capacidade entre 100 e 10,000
            img_banner: `https://source.unsplash.com/random/800x600?sig=${uuid4()}`, // Imagem aleatória de banner
            img_thumbnail: `https://source.unsplash.com/random/400x300?sig=${uuid4()}`, // Imagem aleatória de thumbnail
            location_id: randomVenue.id,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}` // Cor aleatória
        });
    }

    try {
        await prisma.event.createMany({
            data: events
        });
        console.log("Eventos aleatórios criados com sucesso!");
    } catch (error) {
        console.error("Erro ao criar eventos aleatórios:", error);
    }
}


const createVenues = async (prismaCliente: PrismaClient) => {
    // await prisma.venue.deleteMany({});
    const venues = [
        {
            "name": "Maracanã",
            "address_type": "Avenida",
            "address": "Avenida Presidente Castelo Branco",
            "number": "Portão 3",
            "zip_code": "20271-130",
            "city": "Rio de Janeiro",
            "uf": "RJ",
            "country": "BRASIL",
            "complements": "Maracanã",
            "latitude": -22.9121,
            "longitude": -43.2302
        },
        {
            "name": "Allianz Parque",
            "address_type": "Rua",
            "address": "Rua Palestra Itália",
            "number": "200",
            "zip_code": "05005-030",
            "city": "São Paulo",
            "uf": "SP",
            "country": "BRASIL",
            "complements": "Perdizes",
            "latitude": -23.5275,
            "longitude": -46.6781
        },
        {
            "name": "Mineirão",
            "address_type": "Avenida",
            "address": "Avenida Antônio Abrahão Caram",
            "number": "1001",
            "zip_code": "31275-000",
            "city": "Belo Horizonte",
            "uf": "MG",
            "country": "BRASIL",
            "complements": "Pampulha",
            "latitude": -19.8659,
            "longitude": -43.9704
        },
        {
            "name": "Arena Fonte Nova",
            "address_type": "Ladeira",
            "address": "Ladeira da Fonte das Pedras",
            "number": "S/N",
            "zip_code": "40050-565",
            "city": "Salvador",
            "uf": "BA",
            "country": "BRASIL",
            "complements": "Nazaré",
            "latitude": -12.9786,
            "longitude": -38.5043
        },
        {
            "name": "Arena da Baixada",
            "address_type": "Rua",
            "address": "Rua Buenos Aires",
            "number": "1260",
            "zip_code": "80250-070",
            "city": "Curitiba",
            "uf": "PR",
            "country": "BRASIL",
            "complements": "Água Verde",
            "latitude": -25.4484,
            "longitude": -49.2769
        },
        {
            "name": "Arena Pernambuco",
            "address_type": "Avenida",
            "address": "Avenida Deus é Fiel",
            "number": "S/N",
            "zip_code": "54753-510",
            "city": "São Lourenço da Mata",
            "uf": "PE",
            "country": "BRASIL",
            "complements": "Cidade da Copa",
            "latitude": -8.0358,
            "longitude": -35.0081
        },
        {
            "name": "Beira-Rio",
            "address_type": "Avenida",
            "address": "Avenida Padre Cacique",
            "number": "891",
            "zip_code": "90810-240",
            "city": "Porto Alegre",
            "uf": "RS",
            "country": "BRASIL",
            "complements": "Praia de Belas",
            "latitude": -30.0652,
            "longitude": -51.2350
        },
        {
            "name": "Estádio Olímpico Nilton Santos",
            "address_type": "Rua",
            "address": "Rua José dos Reis",
            "number": "425",
            "zip_code": "20921-320",
            "city": "Rio de Janeiro",
            "uf": "RJ",
            "country": "BRASIL",
            "complements": "Engenho de Dentro",
            "latitude": -22.8908,
            "longitude": -43.2937
        },
        {
            "name": "Morumbi",
            "address_type": "Praça",
            "address": "Praça Roberto Gomes Pedrosa",
            "number": "1",
            "zip_code": "05653-070",
            "city": "São Paulo",
            "uf": "SP",
            "country": "BRASIL",
            "complements": "Morumbi",
            "latitude": -23.6000,
            "longitude": -46.7225
        },
        {
            "name": "Arena Castelão",
            "address_type": "Avenida",
            "address": "Avenida Alberto Craveiro",
            "number": "2901",
            "zip_code": "60860-212",
            "city": "Fortaleza",
            "uf": "CE",
            "country": "BRASIL",
            "complements": "Castelão",
            "latitude": -3.7934,
            "longitude": -38.5222
        }
    ];

    const storedVenuesCount = await prismaCliente.venue.count();
    if (storedVenuesCount !== venues.length) {
        await prismaCliente.venue.createMany({
            data: venues
        });
    }
}


const createCategories = async (prismaCliente: PrismaClient) => {
    try {
        await prismaCliente.category.createMany({
            data: [
                { name: "Música", description: "Eventos relacionados a apresentações musicais e shows." },
                { name: "Esportes", description: "Eventos esportivos incluindo futebol, basquete, etc." },
                { name: "Tecnologia", description: "Conferências de tecnologia, hackathons e workshops." },
                { name: "Arte", description: "Exposições de arte, oficinas de pintura e mais." },
                { name: "Educação", description: "Eventos educacionais, seminários e palestras." },
                { name: "Gastronomia", description: "Festivais de comida, degustações e competições culinárias." },
                { name: "Moda", description: "Desfiles de moda, lançamentos de coleções e exposições de moda." }
            ]
        });
        console.log("Categorias criadas com sucesso!");
    } catch (error) {
        // console.error("Erro ao criar categorias:", error);
        if ((error instanceof PrismaClientKnownRequestError)) {
            if (error.code === 'P2002') {
                console.error(`Categoria de Teste já existe.`);
            } else {
                throw error;
            }
        };
    }
};


// Função que inicia logo após API estar online, cria dados para teste
export const initialData = async () => {
    await createusers()

    await createTicketTypes(prisma);
    await createVenues(prisma);
    await createCategories(prisma);

    await createRandomEvents();
    await createRandomOrders()
}
