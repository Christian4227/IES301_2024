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
        // #getNamedRole = (role: string) => {
        //   switch (role) {
        //     case 0:
        //       return "admin";
        //     case 1:
        //       return "organizador";
        //     case 2:
        //       return "colaborador";
        //     case 3:
        //       return "cliente";
        //   }
        // }
        this.generateCookie = async (credentials, asignJwt, setCookie) => {
            const { email, password: candidatePassword } = credentials;
            // find a user by email
            const user = await userRepository.findByEmail(email);
            if (!user)
                throw new Error("Invalid email or password");
            const { password: hash, salt, id: sub, type: role } = user;
            // verify password
            const correctPassword = (0, hash_1.verifyPassword)({ candidatePassword, salt, hash });
            if (correctPassword) {
                // const { password, salt, ...rest } = user;
                // # const payload = { login: email, role: this.#getNamedRole(role) }
                const payload = { login: email, role };
                const token = await asignJwt(payload, { sign: { sub, expiresIn: '3h' } });
                setCookie('access_token', token, {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                });
                return token;
            }
            throw new Error("Invalid email or password");
        };
        // generateToken = async (credentials: UserCredentials, asignJwt: AsignJwt): Promise<string> => {
        //   const { email, password: candidatePassword } = credentials;
        //   // find a user by email
        //   const user = await userRepository.findByEmail(email);
        //   if (!user)
        //     throw new Error("Invalid email or password");
        //   const { password: hash, salt, id: sub } = user;
        //   // verify password
        //   const correctPassword = verifyPassword({ candidatePassword, salt, hash });
        //   if (correctPassword) {
        //     // const { password, salt, ...rest } = user;
        //     const token = await asignJwt({ login: email }, { sign: { sub, expiresIn: '12h' } });
        //     return token;
        //   }
        //   throw new Error("Invalid email or password");
        // }
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
