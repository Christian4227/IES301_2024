import * as userRepository from "../repositories/user.repository"
import { User, UserCreate } from "../interfaces/user.interface"

class UserService {
  create = async (user: UserCreate): Promise<User> => {
    const verifyIfUserExists = await userRepository.findByEmail(user.email);
    if (verifyIfUserExists) {
      throw new Error('User already exists');
    }
    const result = await userRepository.create(user);

    return result;
  };

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