"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const all_controllers_1 = require("./controllers/all_controllers");
const api = (0, fastify_1.default)({ logger: true });
(async () => {
    try {
        api.register(all_controllers_1.HomeRoute, { prefix: '/v1/home' });
        api.register(all_controllers_1.UserRoute, { prefix: '/v1/users' });
    }
    catch (error) {
        console.error('Erro ao importar os controladores:', error);
    }
    api.listen({
        port: 3333,
    }, () => { console.log('Server Subiu.'); });
})();
