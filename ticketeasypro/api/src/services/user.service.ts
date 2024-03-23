import * as userRepository from "../repositories/user.repository";
import { User, UserCreate, UserLogin } from "../interfaces/user.interface";
import { hashPassword, verifyPassword } from "../utils/hash";
import { DataToken } from "../interfaces/toke.interface";

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

  login = async (credentials: UserLogin): Promise<DataToken> => {

    // find a user by email
    const user = await userRepository.findByEmail(credentials.email);

    if (!user) {
      throw new Error("Invalid email or password");
      // return  reply.code(401).send({
      //   message: "Invalid email or password",
      // });
    }

    // verify password
    const correctPassword = verifyPassword({
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