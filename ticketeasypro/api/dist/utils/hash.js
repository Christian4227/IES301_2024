"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
function hashPassword(password) {
    /*
     * Creating a unique salt for a particular user
     * Salt is a random bit of data added to the user's password
     * Salt means that every password's hash is going to be unique
     */
    const salt = crypto_1.default.randomBytes(16).toString("hex");
    /*
     * Create a hash with 1000 iterations
     */
    const hash = crypto_1.default
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
    return { hash, salt };
}
exports.hashPassword = hashPassword;
function verifyPassword({ candidatePassword, salt, hash, }) {
    /*
     * Create a hash with the salt from the user and the password
     * the user tried to login with
     */
    const candidateHash = crypto_1.default
        .pbkdf2Sync(candidatePassword, salt, 1000, 64, "sha512")
        .toString("hex");
    /*
     * If the hash matches the hash we have stored for the user
     * then the candidate password is correct
     */
    return candidateHash === hash;
}
exports.verifyPassword = verifyPassword;
