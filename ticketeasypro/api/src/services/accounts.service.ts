
import { Role } from "@prisma/client";
import { canDoIt } from "@utils/roles";
import { PaginatedAccountResult, AccountUpdate, AccountCreate, AccountUpdateResult } from "./../interfaces/service/account.interface";
import { randomUUID } from "crypto";
import AccountRepository from "../repositories/account.repository";
import { hashPassword } from "@utils/hash";
import { Identifier } from "types/common.type";

class AccountService {
  private accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }
  create = async (actorRole: Role, accountCreate: AccountCreate): Promise<AccountCreate> => {
    const { email, role, ...rest } = accountCreate;
    if (!canDoIt(actorRole, role)) throw new Error('Insufficient permissions.');

    const verifyIfAccountExists = await this.accountRepository.find({ email: email } as Identifier);

    if (verifyIfAccountExists) throw new Error('Account already exists');

    // cria senha temporária
    const tempPassword = `_-_tEmP_${randomUUID()}RAry_${randomUUID()}pa$sW&ord._+=`;

    const { hash, salt } = hashPassword(tempPassword);

    const account = await this.accountRepository.create({ ...rest, role, email, salt, password: hash });

    const accountCreateData: AccountCreate = {
      email: account.email, name: account.name, email_confirmed: account.email_confirmed, birth_date: account.birth_date,
      phone: account.phone, phone_fix: account.phone_fix, role: account.role
    };
    return accountCreateData;
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
}
export default AccountService;