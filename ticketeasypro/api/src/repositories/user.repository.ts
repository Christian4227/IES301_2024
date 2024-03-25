
import { User, UserCreate } from "../interfaces/user.interface";
import { prisma } from "../services/prisma";

export async function create({ email, name, birth_date, phone, phone_fix, password, salt }: UserCreate): Promise<User> {
    const result = await prisma.user.create({ data: { name, email, birth_date, phone, password, salt, phone_fix } });
    return result;
}

export const findByEmail = async (email: string): Promise<User | null> => {
    const result = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    return result || null;
}
export const findById = async (user_id: string): Promise<User | null> => {

    const result = await prisma.user.findUnique({ where: { id: user_id } });
    return result || null;
}
export const findAll = async (): Promise<User[]> => {
    const result = await prisma.user.findMany();
    return result;
}
export const deleteById = async (user_id: string): Promise<User | null> => {
    const result = await prisma.user.delete({ where: { id: user_id } });
    return result || null;
}
