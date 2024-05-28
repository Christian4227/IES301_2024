
import { Role } from "@prisma/client";
import { canDoIt } from "@utils/roles";
import { PaginatedAccountResult, AccountUpdate, AccountCreate, AccountUpdateResult } from "@interfaces/service/account.interface";
import { randomUUID } from "crypto";
import AccountRepository from "../repositories/account.repository";
import { hashPassword } from "@utils/hash";
import { Identifier } from "types/common.type";
import { FastifyInstance } from "types/fastify";
import { AccountCreateResult, AccountResult } from "@interfaces/repository/account.interface";
import { generateConfirmationToken } from "@utils/auth";

class AccountService {
  private accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }
  create = async (actorRole: Role, accountCreate: AccountCreate): Promise<AccountCreateResult> => {
    const { email, role, ...rest } = accountCreate;
    if (!canDoIt(actorRole, role)) throw new Error('Insufficient permissions.');

    const verifyIfAccountExists = await this.accountRepository.find({ email: email } as Identifier);

    if (verifyIfAccountExists) throw new Error('Account already exists');

    // cria senha temporária
    const tempPassword = `_-_tEmP_${randomUUID()}RAry_${randomUUID()}pa$sW&ord._+=`;

    const { hash, salt } = hashPassword(tempPassword);

    const account: AccountCreateResult = await this.accountRepository.create({ ...rest, role, email, salt, password: hash });

    // const accountCreateData: AccountCreateResult = {
    //   id: account.id,
    //   email: account.email, name: account.name, email_confirmed: account.email_confirmed, birth_date: account.birth_date,
    //   phone: account.phone, phone_fix: account.phone_fix, role: account.role, 
    // };
    return account;
  }

  update = async (actorRole: Role, targetId: string, dataUpdate: AccountUpdate): Promise<AccountUpdateResult> => {
    const newRole = dataUpdate.role;
    const targetAccount = await this.accountRepository.find({ id: targetId })

    if (newRole && !canDoIt(actorRole, targetAccount ? targetAccount.role : ('SPECTATOR' as Role)))
      throw new Error('Insufficient permissions.');
    try {
      const account = await this.accountRepository.update({ id: targetId }, dataUpdate);
      return account;
    } catch (error) {
      throw error;
    }
  }
  /** 
  * Método para listar contas com base no tipo especificado, com paginação.
  * @param query String de parte da pesquisa.
  * @param role string que termina o papel do usuário
  * @param page Número da página atual.
  * @param pageSize Número de itens por página.
  * @returns Uma lista paginada de contas.
  */
  searchAccounts = async (query: string, role?: string, page: number = 1, pageSize: number = 10): Promise<PaginatedAccountResult> => {

    const paginatedUserResults: PaginatedAccountResult = await this.accountRepository.findAccounts(query, role as Role, page, pageSize);
    return paginatedUserResults;
  }
  /**
 * Método para validar o token de confirmação de email.
 * @param token O token de confirmação de email.
 * @param api A instancia de Fastify.
 * @returns O resultado da validação e confirmação do email.
 */
  validateEmailConfirmationToken = async (token: string, api: FastifyInstance): Promise<AccountResult> => {

    const decoded = api.jwt.verify(token) as { sub: string };
    const userId = decoded.sub;

    const account = await this.accountRepository.find({ id: userId });
    if (!account) throw new Error('Account not found');

    try {
      const account = await this.accountRepository.update({ id: userId }, { email_confirmed: true });
      return account;
    } catch (erro) {
      console.error("Error in AccountService.validateEmailConfirmationToken:", "error"); //
      // if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new Error('Invalid or expired token');
    }
    // throw error;:
  };
  reSendConfirmationEmail = async (email: string, api: FastifyInstance): Promise<AccountResult> => {
    try {
      const account = await this.accountRepository.find({ email: email } as Identifier);
      if (!account) throw new Error('Account not found');

      if (account.email_confirmed) throw new Error("Email already confirmed.");

      const token = await generateConfirmationToken(account, api);
      // const serverAddress = api.server.address();

      const protocol = api.server instanceof require('https').Server ? 'https' : 'http';
      const serverAddress = '127.0.0.1';
      const port = 3210;
      const confirmationBaseUrl = `${protocol}://${serverAddress}:${port}/v1/accounts/confirm-email`;
      const confirmationUrl = `${confirmationBaseUrl}?token=${encodeURIComponent(token)}`;
      // let confirmationBaseUrl;
      // if (typeof serverAddress === 'string') {
      //   // Handle case where address is a string (older Node.js versions)
      //   confirmationBaseUrl = `https://${serverAddress}`;
      // } else if (serverAddress) { // Assuming serverAddress is an object
      //   // Handle case where address is an object (likely AddressInfo)
      //   confirmationBaseUrl = `https://${serverAddress.address}:${serverAddress.port}`;
      // } else {
      //   // Handle case where serverAddress is undefined (unlikely but possible)
      //   console.error('Failed to get server address for confirmation URL');
      //   // You might want to handle this error gracefully, e.g., return an error response
      // }
      // const confirmationUrl = `${confirmationBaseUrl}/accounts/confirm-email?token=${encodeURIComponent(token)}`
      // api.log.debug(`link de validação de email :-> ${confirmationUrl}`);
      api.log.debug(`link de validação de email :-> ${confirmationUrl}`);


      return account;
      // await this.transporter.sendMail({
      //   to: email,
      //   subject: 'Confirmation Email Resent',
      //   html: `Please click this link to confirm your email: <a href="${confirmationUrl}">${confirmationUrl}</a>`,
      // });
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      throw error
    }
  };

}
export default AccountService;