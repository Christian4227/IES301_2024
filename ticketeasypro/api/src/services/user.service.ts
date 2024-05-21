import UserRepository from "../repositories/user.repository";
import { hashPassword, verifyPassword } from "../utils/hash";
import { PaginatedUserResult, UserCreateResult } from "../types/service/user.type";
import { AsignJwt, SetCookie, UserCredentials, UserResult, UserSignin, UserUpdate } from "../interfaces/service/user.interface";
import { Role } from "@prisma/client";
import { UserPayload } from "../types";
import { Identifier } from "types/common.type";


class UserService {

	private userRepo: UserRepository

	constructor() {
		this.userRepo = new UserRepository();
	}

	create = async (userSignin: UserSignin, role: Role = Role.SPECTATOR): Promise<UserCreateResult> => {
		const { email, password, confirm_password, ...rest } = userSignin;

		// Verifica se as senhas correspondem
		if (password !== confirm_password) throw new Error("Passwords do not match.");

		const userFound = await this.userRepo.find({ email: email } as Identifier);

		if (!!userFound) throw new Error('User already exists');

		const { hash, salt } = hashPassword(password);

		const user = await this.userRepo.create({ ...rest, role, email, salt, password: hash });

		return user;
	};

	generateCookie = async (credentials: UserCredentials, asignJwt: AsignJwt, setCookie: SetCookie) => {
		const { email, password: candidatePassword } = credentials;

		// find a user by email
		const user = await this.userRepo.find({ email });

		if (!user) throw new Error("Invalid email or password");
		if (!user.active) throw new Error("This user account is inactive.");

		const { password: hashedPassword, salt, id: sub, role: role, name: userName } = user;

		// verify password
		const correctPassword = verifyPassword({ candidatePassword, salt, hashedPassword });

		if (!correctPassword) throw new Error("Invalid email or password");

		const payload: UserPayload = { sub: sub, login: email, role: role, name: userName }
		const token = await asignJwt(payload, { sign: { expiresIn: '6h' } });
		setCookie('access_token', token, {
			path: '/',
			httpOnly: true,
			secure: true,
		})
		return token;
	}

	find = async (email: string): Promise<UserResult | null> => {
		const user = await this.userRepo.find(email as Identifier);
		return user;
	};

	update = async (identifier: Identifier, userData: UserUpdate): Promise<UserResult> => {
		// const userId = dataUpdate.id;
		const user = await this.userRepo.update(identifier, userData);
		return user;
	}
	// updateRole = async ({ id: userID, role }: UserUpdateRole): Promise<Role> => {
	// 	return await this.userRepo.update(userID, { role: role })

	// }
	toggleStatus = async (identifier: Identifier): Promise<boolean> => {
		const user = await this.userRepo.find(identifier);
		if (!!!user)
			throw new Error(`User ${identifier.id ? `id: ${identifier.id}` : `email: ${identifier.email}`} not found`);

		const userUpdated = await this.userRepo.update(identifier, { active: !user.active });
		return !!userUpdated;
	};

	// getAll = async (query: string, page: number = 1, pageSize: number = 10): Promise<PaginatedUserResult> => {
	// return await this.userRepo.findUsers(query, page, pageSize);
	// }


}

export default UserService;