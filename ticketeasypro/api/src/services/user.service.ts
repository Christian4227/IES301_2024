import UserRepository from "../repositories/user.repository";
import { hashPassword, verifyPassword } from "../utils/hash";
import { UserCreateResult } from "../types/service/user.type";
import { AsignJwt, SetCookie, UserCredentials, UserResult, UserSignin, UserUpdate } from "../interfaces/service/user.interface";
import { Role } from "@prisma/client";
import { UserPayload } from "../types";
import { Identifier } from "types/common.type";
import { FastifyInstance } from "fastify/types/instance";
import AccountService from "./account.service";


class UserService {

	private userRepo: UserRepository
	private accountService: AccountService

	constructor() {
		this.userRepo = new UserRepository();
		this.accountService = new AccountService();
	};

	create = async (userSignin: UserSignin, role: Role = Role.SPECTATOR, api: FastifyInstance): Promise<UserCreateResult> => {
		const { email, password, confirm_password, ...rest } = userSignin;

		// Verifica se as senhas correspondem
		if (password !== confirm_password) throw new Error("PasswordsDoNotMatch.");

		const userFound = await this.userRepo.find({ email: email } as Identifier);

		if (!!userFound) throw new Error('UserAlreadyExists');

		const { hash, salt } = hashPassword(password);

		const user = await this.userRepo.create({ ...rest, role, email, salt, password: hash });
		const emailSended = await this.accountService.reSendConfirmationEmail(user.email, api);

		return user;
	};

	generateCookie = async (credentials: UserCredentials, asignJwt: AsignJwt, setCookie: SetCookie) => {
		const { email, password: candidatePassword } = credentials;
		// find a user by email
		const user = await this.userRepo.find({ email });

		if (!user) throw new Error("InvalidEmailOrPassword");
		if (!user.active) throw new Error("AccountEmailIsInactive.");

		const { password: hashedPassword, salt, id: sub, role: role, name: userName, email_confirmed } = user;
		if (!email_confirmed) throw new Error("AccountEmailMustBeValidated.");
		// verify password
		const correctPassword = verifyPassword({ candidatePassword, salt, hashedPassword });

		if (!correctPassword) throw new Error("InvalidEmailOrPassword");

		const payload: UserPayload = { sub: sub, login: email, role: role, name: userName }
		const token = await asignJwt(payload, { sign: { expiresIn: '12h' } });
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
	};
	toggleStatus = async (identifier: Identifier): Promise<boolean> => {
		const user = await this.userRepo.find(identifier);
		if (!!!user)
			throw new Error(`User ${identifier.id ? `id: ${identifier.id}` : `email: ${identifier.email}`} not found`);

		const userUpdated = await this.userRepo.update(identifier, { active: !user.active });
		return !!userUpdated;
	};

}

export default UserService;