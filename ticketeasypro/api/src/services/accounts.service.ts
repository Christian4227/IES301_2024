
import { Role } from "@prisma/client";
import { canDoIt } from "@utils/roles";
import { PaginatedAccountResult, AccountUpdate, AccountCreate, AccountUpdateResult } from "@interfaces/service/account.interface";
import AccountRepository from "../repositories/account.repository";
import { hashPassword } from "@utils/hash";
import { Identifier } from "types/common.type";
import { FastifyInstance } from "types/fastify";
import { AccountCreateResult, AccountResult } from "@interfaces/repository/account.interface";
import { generateConfirmationToken } from "@utils/auth";
import sendEmail from "@utils/sendEmail";
import { makeConfirmEmailContent } from "@utils/templates";
import { generateRandomPassword, getLocalbaseURL } from "@utils/mixes";
type Err = { message: string, code: string }
class AccountService {
  private accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }
  create = async (actorRole: Role, accountCreate: AccountCreate): Promise<AccountCreateResult> => {
    const { email, role: roleAccountCreate, ...rest } = accountCreate;
    if (!(actorRole === roleAccountCreate && (actorRole === Role.ADMIN || actorRole === Role.EVENT_MANAGER)))
      if (!canDoIt(actorRole, roleAccountCreate)) throw new Error('Insufficient permissions.');


    const verifyIfAccountExists = await this.accountRepository.find({ email: email } as Identifier);

    if (verifyIfAccountExists) throw new Error('Account already exists');

    // cria senha temporária

    // const tempPassword = `_-_tEmP_${randomUUID()}RAry_${randomUUID()}pa$sW&ord._+=`;
    const tempPassword = `_-_tEmP_pa$sW&ord._+=${generateRandomPassword(24)}`;

    const { hash, salt } = hashPassword(tempPassword);

    const accountToCreate = { ...rest, role: roleAccountCreate, email, salt, password: hash };

    const account: AccountCreateResult = await this.accountRepository.create(accountToCreate);

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
    try {
      const decoded = api.jwt.verify(token) as { sub: string };
      const userId = decoded.sub;

      const account = await this.accountRepository.find({ id: userId });
      if (!account) throw new Error('AccountNotFound');
      if (account.email_confirmed) throw new Error('EmailAlreadyConfirmed');

      const updatedAccount = await this.accountRepository.update({ id: userId }, { email_confirmed: true });
      return updatedAccount;
    } catch (error: unknown) {
      if (error instanceof Error) {

        if (error.message.toLowerCase().startsWith('the token has expired')) {
          throw new Error('InvalidOrExpiredToken');
        } else if (error.message === 'AccountNotFound' || error.message === 'EmailAlreadyConfirmed') {
          throw error;
        }
      }
      throw new Error('UnknownError');
    };
    
  };

  reSendConfirmationEmail = async (email: string, api: FastifyInstance): Promise<AccountResult> => {
    try {
      const account = await this.accountRepository.find({ email: email } as Identifier);
      if (!account) throw new Error('AccountNotFound');

      if (account.email_confirmed) throw new Error('EmailAlreadyConfirmed');

      const tokenConfirmation = await generateConfirmationToken(account, api);
      const baseUrl = getLocalbaseURL(api);
      const confirmationBaseUrl = `${baseUrl}/Contas/RecuperarEmail`;
      const confirmationUrl = `${confirmationBaseUrl}?token=${encodeURIComponent(tokenConfirmation)}`;

      const emailContent = makeConfirmEmailContent(account, confirmationUrl);
      await sendEmail(email, "Confirme o seu e-mail.", emailContent);


      // api.log.debug(`link de validação de email :-> ${confirmationUrl}`);
      api.log.debug(`link de validação de email :-> ${confirmationUrl}`);


      return account;
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      throw error
    }
  };

}
export default AccountService;