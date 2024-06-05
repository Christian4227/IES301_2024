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
import { makeConfirmEmailContent, makeResetEmailContent } from "@utils/templates";
import { generateRandomPassword, getLocalbaseURL } from "@utils/mixes";
import crypto from "crypto";


class AccountService {
  private accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }
  create = async (actorRole: Role, accountCreate: AccountCreate, api: FastifyInstance): Promise<AccountCreateResult> => {
    const { email, role: roleAccountCreate, ...rest } = accountCreate;
    if (!(actorRole === roleAccountCreate && (actorRole === Role.ADMIN || actorRole === Role.EVENT_MANAGER)))
      if (!canDoIt(actorRole, roleAccountCreate)) throw new Error('InsufficientPermissions');

    const verifyIfAccountExists = await this.getOne(email);

    if (verifyIfAccountExists) throw new Error('AccountAlreadyExists');

    // cria senha temporária
    const tempPassword = `_-_tEmP_pa$sW&ord._+=${generateRandomPassword(24)}`;

    const { hash, salt } = hashPassword(tempPassword);

    const accountToCreate = { ...rest, role: roleAccountCreate, email, salt, password: hash };

    const account: AccountCreateResult = await this.accountRepository.create(accountToCreate);

    const emailSended = await this.reSendConfirmationEmail(email, api);

    return account;
  }

  update = async (actorRole: Role, targetId: string, dataUpdate: AccountUpdate): Promise<AccountUpdateResult> => {
    const newRole = dataUpdate.role;
    const targetAccount = await this.accountRepository.find({ id: targetId })

    if (newRole && !canDoIt(actorRole, targetAccount ? targetAccount.role : ('SPECTATOR' as Role)))
      throw new Error('InsufficientPermissions');
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


  // Reset Password Verification Function
  verifyResetToken = async (token: string, newPassword: string) => {
    token = decodeURIComponent(token);
    const user = await this.accountRepository.findWhere({ token, token_expires: { gt: new Date() } });

    if (!user) throw new Error('InvalidOrExpiredToken');

    const { hash, salt } = hashPassword(newPassword);

    const passwordUpdateData = { salt, password: hash, token: undefined, token_expires: undefined };

    // Update the password and clear the reset token fields
    await this.accountRepository.update({ id: user.id }, passwordUpdateData);

  };
  passwordReset = async (email: string, api: FastifyInstance) => {

    const account = await this.getOne(email);
    if (!account) throw new Error('AccountNotFound');

    const resetPasswordToken = crypto.randomBytes(64).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 60 * 15 * 1000); // 15 minutos

    await this.accountRepository.update({ email }, { token: resetPasswordToken, token_expires: resetPasswordExpires });

    const baseUrl = getLocalbaseURL(api);
    const resetBaseURL = `${baseUrl}/Contas/RedefinirSenha`
    const resetURL = `${resetBaseURL}?token=${encodeURIComponent(resetPasswordToken)}`;

    const emailContent = makeResetEmailContent({ ...account }, resetURL);
    await sendEmail(email, "Redefina sua senha.", emailContent);
  };

  reSendConfirmationEmail = async (email: string, api: FastifyInstance): Promise<AccountResult> => {
    try {
      const account = await this.getOne(email);

      if (account.email_confirmed) throw new Error('EmailAlreadyConfirmed');

      const tokenConfirmation = await generateConfirmationToken(account, api);
      const baseUrl = getLocalbaseURL(api);
      const confirmationBaseUrl = `${baseUrl}/Contas/RecuperarEmail`;
      const confirmationUrl = `${confirmationBaseUrl}?token=${encodeURIComponent(tokenConfirmation)}`;


      const emailContent = makeConfirmEmailContent(account, confirmationUrl);
      await sendEmail(email, "Confirme o seu e-mail.", emailContent);
      return account;
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      throw error
    }
  };
  /**
  * Método para validar o token de confirmação de email.
  * @param token O token de confirmação de email.
  * @param api A instancia de Fastify.
  * @returns O resultado da validação e confirmação do email.
  */
  validateEmailConfirmationToken = async (token: string, api: FastifyInstance): Promise<AccountResult> => {
    try {
      token = decodeURIComponent(token);
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

  getOne = async (email: string): Promise<AccountResult> => {
    const account = await this.accountRepository.find({ email: email } as Identifier);
    if (!account) throw new Error('AccountNotFound');
    return account;
  }


}
export default AccountService;