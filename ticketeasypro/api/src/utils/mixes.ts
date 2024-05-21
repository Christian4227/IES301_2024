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
// Retorna um objeto contendo apenas os atributos compartilhados entre os objetos cujo os valores são diferentes
// export const getAllDiff = (objA: { [key: string]: any }, objB: { [key: string]: any }): Object => {
//     let objResult = Object();
//     for (const key in objA) {
//         if (objB.hasOwnProperty(key)) {
//             if (objA[key] !== objB[key]) {
//                 objResult[key] = objB[key]
//             }
//         }
//     }
//     return objResult;
// }

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