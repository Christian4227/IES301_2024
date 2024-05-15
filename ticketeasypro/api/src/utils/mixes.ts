import { Identifier } from "types/common.type";

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