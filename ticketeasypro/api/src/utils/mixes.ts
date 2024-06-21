import { FastifyInstance } from "fastify";
import { Identifier } from "types/common.type";
// Compara se cada atriburo em comum a ambos objetos tem valores iguais
export const areAttributesEqual = (objA: { [key: string]: any }, objB: { [key: string]: any }): boolean => {
    for (const key in objA) {
        if (objB.hasOwnProperty(key)) {
            if (objA[key] !== objB[key]) {
                return false;
            }
        }
    }
    return true;
}

export const getDifferences = (original: any, updated: any): Partial<any> => {
    const differences: Partial<any> = {};
    for (const key in updated) {
        if (updated[key] !== original[key]) {
            differences[key] = updated[key];
        }
    }
    return differences;
};

export const filterNullsData = (data: Record<string, any>) => {
    return Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== null)
    ) as Record<string, any>;
};


export const buildWhereClause = (identifier: Identifier) => {
    const { id, email } = identifier;
    if (!email && !id) {
        throw new Error("Either email or id must be provided.");
    }

    return id ? { id } : { email };
}

export const isValidDateRange = (startDate: number, endDate: number) => {
    // Verifica se ambos startDate e endDate são instâncias de Date
    // if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    //     console.error("Both startDate and endDate must be Date instances.");
    //     return false;
    // }

    // Verifica se alguma das datas é 'Invalid Date'
    if (isNaN(startDate) || isNaN(endDate)) {
        console.error("Either startDate or endDate is an invalid Date.");
        return false;
    }


    // Verifica se a data de início é anterior à data de término
    if (startDate >= endDate) {
        console.error("startDate must be earlier than endDate.");
        return false;
    }

    return true;
}

export const generateRandomPassword = (length = 12) => {
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?';

    const allCharacters = upperCaseLetters + lowerCaseLetters + numbers + specialCharacters;

    let password = '';

    // Garantir que a senha contenha pelo menos um de cada tipo de caractere
    password += upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
    password += lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

    // Preencher o restante da senha com caracteres aleatórios
    for (let i = 4; i < length; i++) {
        password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }

    // Embaralhar a senha para garantir que os caracteres não estejam em uma ordem previsível
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    return password;
}

export const getLocalbaseURL = (api: FastifyInstance) => {
    const protocol = api.server instanceof require('https').Server ? 'https' : 'http';
    const port = process.env.PORT_FRONTEND;
    const serverAddress = process.env.HOST_FRONTEND
    const baseURL = `${protocol}://${serverAddress}:${port}`
    return baseURL
}

// Função para obter o timestamp UNIX correspondente ao primeiro segundo do dia atual
export const getStartOfDayTimestamp = (): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Define a hora para 00:00:00
    return Math.floor(today.getTime()); // Retorna o timestamp UNIX
};
// Função para obter o timestamp UNIX correspondente ao último segundo do último dia do mês seguinte
export const getLastdayOfNextMonthTimestamp = (): number => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    nextMonth.setHours(23, 59, 59, 999); // Define a hora para 23:59:59.999
    return Math.floor(nextMonth.getTime()); // Retorna o timestamp UNIX
};