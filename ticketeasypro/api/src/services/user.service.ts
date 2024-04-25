import * as userRepository from "../repositories/user.repository";
import { User, UserCreate, UserCredentials } from "../interfaces/user.interface";
import { hashPassword, verifyPassword } from "../utils/hash";
import { FastifyJwtSignOptions, SignPayloadType } from "@fastify/jwt";
import { CookieSerializeOptions } from "@fastify/cookie";
import { FastifyReply } from "fastify/types/reply";


interface AsignJwt {
  (payload: SignPayloadType, options?: FastifyJwtSignOptions): Promise<string>
}
interface AsignCookie {
  (cookieName: string, toke: string, options: Object): Promise<any>
}

interface SetCookie {
  (name: string, value: string, options?: CookieSerializeOptions): FastifyReply;
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

  generateCookie = async (credentials: UserCredentials, asignJwt: AsignJwt, setCookie: SetCookie) => {

    const { email, password: candidatePassword } = credentials;

    // find a user by email
    const user = await userRepository.findByEmail(email);

    if (!user)
      throw new Error("Invalid email or password");

    const { password: hash, salt, id: sub, role: role } = user;

    // verify password
    const correctPassword = verifyPassword({ candidatePassword, salt, hash });

    if (correctPassword) {
      // const { password, salt, ...rest } = user;
      // # const payload = { login: email, role: this.#getNamedRole(role) }
      const payload = { login: email, role }
      const token = await asignJwt(payload, { sign: { sub, expiresIn: '3h' } });
      setCookie('access_token', token, {
        path: '/',
        httpOnly: true,
        secure: true,
      })

      return token;
    }
    throw new Error("Invalid email or password");

  }

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


  find = async (user_email: string): Promise<User | null> => {
    const user = await userRepository.findByEmail(user_email);
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