import * as userRepository from "../repositories/user.repository";
import { User, UserCreate, UserCredentials } from "../interfaces/user.interface";
import { hashPassword, verifyPassword } from "../utils/hash";
import { DataToken, Token } from "../interfaces/token.interface";
import { FastifyJwtSignOptions, SignPayloadType } from "@fastify/jwt";


interface AsignJwt {
  (payload: SignPayloadType, options?: FastifyJwtSignOptions): Promise<string>
}

class UserService {
  create = async (user: UserCreate): Promise<User> => {
    const { email, password, ...rest } = user;

    const verifyIfUserExists = await userRepository.findByEmail(email);
    if (verifyIfUserExists) {
      throw new Error('User already exists');
    }
    const { hash, salt } = hashPassword(password);

    const result = await userRepository.create({ ...rest, email, salt, password: hash });

    return result;
  };

  generateToken = async (credentials: UserCredentials, asignJwt: AsignJwt): Promise<string> => {

    const { email, password: candidatePassword } = credentials;

    // find a user by email
    const user = await userRepository.findByEmail(email);

    if (!user)
      throw new Error("Invalid email or password");

    const { password: hash, salt, id: sub } = user;

    // verify password
    const correctPassword = verifyPassword({ candidatePassword, salt, hash });

    if (correctPassword) {
      // const { password, salt, ...rest } = user;
      const token = await asignJwt({ login: email }, { sign: { sub, expiresIn: '12h' } });
      return token;
    }
    throw new Error("Invalid email or password");

  }


  find = async (user_id: string): Promise<User | null> => {
    const user = await userRepository.findById(user_id);
    return user;
  };

  deleteAccount = async (user_id: string): Promise<User | null> => {
    const user = await userRepository.deleteById(user_id);
    return user;
  };
  getAll = async (): Promise<User[]> => {
    const allUsers: User[] = await userRepository.findAll();

    return allUsers;
  };

  // getAll = async (): Promise<User[] | null> => {
  //   const allUsers: User[] = await userRepository.findAll();
  // }
}

export default UserService;