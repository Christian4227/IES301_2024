"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRepository = __importStar(require("../repositories/user.repository"));
const hash_1 = require("../utils/hash");
class UserService {
    constructor() {
        this.create = async (user) => {
            const { email, password, ...rest } = user;
            const verifyIfUserExists = await userRepository.findByEmail(email);
            if (verifyIfUserExists) {
                throw new Error('User already exists');
            }
            const { hash, salt } = (0, hash_1.hashPassword)(password);
            const result = await userRepository.create({ ...rest, email, salt, password: hash });
            return result;
        };
        this.login = async (credentials) => {
            // find a user by email
            const user = await userRepository.findByEmail(credentials.email);
            if (!user) {
                throw new Error("Invalid email or password");
                // return  reply.code(401).send({
                //   message: "Invalid email or password",
                // });
            }
            // verify password
            const correctPassword = (0, hash_1.verifyPassword)({
                candidatePassword: credentials.password,
                salt: user.salt,
                hash: user.password,
            });
            if (correctPassword) {
                const { password, salt, ...rest } = user;
                return rest;
            }
            throw new Error("Invalid email or password");
            // return reply.code(401).send({
            //   message: "Invalid email or password",
            // });
        };
        this.find = async (user_id) => {
            const user = await userRepository.findById(user_id);
            return user;
        };
        this.deleteAccount = async (user_id) => {
            const user = await userRepository.deleteById(user_id);
            return user;
        };
        this.getAll = async () => {
            const allUsers = await userRepository.findAll();
            return allUsers;
        };
        // getAll = async (): Promise<User[] | null> => {
        //   const allUsers: User[] = await userRepository.findAll();
        // }
    }
}
exports.default = UserService;
