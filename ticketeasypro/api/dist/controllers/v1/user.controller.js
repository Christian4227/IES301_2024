"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../../services/user.service"));
const JWTAuth_1 = require("../../middlewares/JWTAuth");
const UserRoute = async (api) => {
    const userService = new user_service_1.default();
    api.post("/signin", async (request, reply) => {
        try {
            const data = await userService.create(request.body);
            return reply.send(data);
        } catch (error) {
            reply.send(error);
        }
    });
    api.post("/login", async (request, reply) => {
        try {
            const credentials = request.body;
            const data = await userService.login(credentials);
            const token = await reply.jwtSign(
                { login: data.email },
                { sign: { sub: data.id, expiresIn: "12h" } }
            );
            return { accessToken: token };
        } catch (error) {
            reply.send(error);
        }
    });
    api.get(
        "/me",
        { onRequest: [JWTAuth_1.verifyJwt] },
        async (request, reply) => {
            // Exibe dados do próprio usuário
            reply.send({ hello: "aswosrld2" });
        }
    );
    api.get("/", async (request, reply) => {
        const all = await userService.getAll();
        return reply.status(200).send(all);
    });
    api.delete("/:id", async (request, reply) => {
        const { id: userId } = request;
        try {
            await userService.deleteAccount(userId);
            return reply.status(204);
        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
            return reply.status(500).send({
                message: "Erro ao excluir usuário",
                error: "Internal Server Error",
            });
        }
    });
};
exports.default = UserRoute;
