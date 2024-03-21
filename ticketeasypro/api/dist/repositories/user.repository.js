"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser2 = exports.createUser = void 0;
const prisma_1 = require("../services/prisma");
const createUser = async (data) => {
    const user = prisma_1.prisma.user.create({
        ...data
    });
};
exports.createUser = createUser;
const createUser2 = async (data) => {
    const user = prisma_1.prisma.user.create({
        ...data
    });
};
exports.createUser2 = createUser2;
