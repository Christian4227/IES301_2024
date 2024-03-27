"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.findAll = exports.findById = exports.findByEmail = exports.create = void 0;
const prisma_1 = require("../services/prisma");
async function create({ email, name, birth_date, phone, phone_fix, password, salt }) {
    const result = await prisma_1.prisma.user.create({ data: { name, email, birth_date, phone, password, salt, phone_fix } });
    return result;
}
exports.create = create;
const findByEmail = async (email) => {
    const result = await prisma_1.prisma.user.findFirst({
        where: {
            email,
        },
    });
    return result || null;
};
exports.findByEmail = findByEmail;
const findById = async (user_id) => {
    const result = await prisma_1.prisma.user.findFirst({ where: { id: user_id } });
    return result || null;
};
exports.findById = findById;
const findAll = async () => {
    const result = await prisma_1.prisma.user.findMany();
    return result;
};
exports.findAll = findAll;
const deleteById = async (user_id) => {
    const result = await prisma_1.prisma.user.delete({ where: { id: user_id } });
    return result || null;
};
exports.deleteById = deleteById;
