import { EventStatus, Role } from "@prisma/client";
import prisma from "./../repositories/prisma";
import uuid4 from "uuid4";

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


function getRandomElement(array: Array<string>) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateRandomEventName() {
    const prefixes = [
        'International', 'Annual', 'Global', 'National', 'Regional', 'Local', 'Special', 'Exclusive', 'Premier', 'Ultimate'
    ];

    const adjectives = [
        'Innovative', 'Inspiring', 'Exciting', 'Dynamic', 'Cutting-Edge', 'Transformative', 'Engaging', 'Interactive', 'Groundbreaking', 'Visionary'
    ];

    const nouns = [
        'Conference', 'Summit', 'Workshop', 'Expo', 'Symposium', 'Forum', 'Festival', 'Convention', 'Seminar', 'Retreat'
    ];

    const prefix = getRandomElement(prefixes);
    const adjective = getRandomElement(adjectives);
    const noun = getRandomElement(nouns);

    return `${prefix} ${adjective} ${noun}`;
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

    const events = [];

    for (let i = 0; i < 100; i++) {
        const randomManager = managers[getRandomInt(0, managers.length - 1)];
        const randomCategory = categories[getRandomInt(0, categories.length - 1)];
        const randomVenue = venues[getRandomInt(0, venues.length - 1)];
        const randomEventName = generateRandomEventName();
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
            base_price: getRandomInt(25000, 500000), // Preço base entre 50 e 500
            capacity: getRandomInt(100, 10000), // Capacidade entre 100 e 10,000
            img_banner: `https://source.unsplash.com/random/800x600?sig=${uuid4()}`, // Imagem aleatória de banner
            img_thumbnail: `https://source.unsplash.com/random/400x300?sig=${uuid4()}`, // Imagem aleatória de thumbnai
            location_id: randomVenue.id,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}` // Cor aleatória
        }
        )
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
export default createRandomEvents;