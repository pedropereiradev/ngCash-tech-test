import { Transaction, Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { ICreditedParams, ITransaction } from '../interfaces/ITransaction';
import Accounts from '../database/models/Accounts';
import Transactions from '../database/models/Transactions';
import Users from '../database/models/Users';
import db from '../database/models';

export default class TransactionsService {
  constructor(
    private transactionModel: typeof Transactions,
    private userModel: typeof Users,
    private accountModel: typeof Accounts,
  ) { }

  private async getUserAccountId(username: string): Promise<string> {
    const result = await this.userModel.findOne({
      where: { username },
      include: [{ model: Accounts }],
    });

    return result?.accountId || '';
  }

  private async getAccountBalance(accountId: string) {
    const result = await this.accountModel.findByPk(accountId);

    return result?.balance || 0;
  }

  private async isCreditedValueValid({ accountId, value }: ICreditedParams) {
    const accountBalance = await this.getAccountBalance(accountId);

    if (value > accountBalance) return null;

    return true;
  }

  private async validations({ accountId, value }: ICreditedParams) {
    const validateCreditedValue = await this.isCreditedValueValid(
      {
        accountId,
        value,
      },
    );

    if (!validateCreditedValue) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: 'Credited value can not be greater than your balance',
      };
    }

    return null;
  }

  private async transactionCreate({
    destinationAccount, originAccount, value,
  }: ITransaction, t: Transaction) {
    await this.transactionModel.create(
      {
        creditedAccountId: destinationAccount,
        debitedAccountId: originAccount,
        value,
      },
      { transaction: t },
    );
  }

  private async accountBalanceUpdate({
    originAccount, destinationAccount, value,
  }: ITransaction, t: Transaction) {
    const creditedAccountBalance = await this.getAccountBalance(originAccount);
    const debitedAccountBalance = await this.getAccountBalance(destinationAccount);

    await this.accountModel.update(
      { balance: Number(creditedAccountBalance) - Number(value) },
      {
        where: { id: originAccount },
        transaction: t,
      },
    );

    await this.accountModel.update(
      { balance: Number(debitedAccountBalance) + Number(value) },
      {
        where: { id: destinationAccount },
        transaction: t,
      },
    );
  }

  public async create(transactionParams: ITransaction) {
    const t = await db.transaction();
    const validateData = await this.validations(
      { accountId: transactionParams.originAccount, value: Number(transactionParams.value) },
    );

    if (validateData) return validateData;

    try {
      await this.accountBalanceUpdate(transactionParams, t);

      await this.transactionCreate(transactionParams, t);

      await t.commit();
    } catch (error) {
      await t.rollback();

      console.error(error);
      return null;
    }
  }

  public async getAll(username: string) {
    const userAccountId = await this.getUserAccountId(username);

    return this.transactionModel.findAll({
      where: {
        [Op.or]: [
          { debitedAccountId: userAccountId },
          { creditedAccountId: userAccountId },
        ],
      },
    });
  }

  public async getAllByCashInOrCashOut(username: string, transactionType: string) {
    const userAccountId = await this.getUserAccountId(username);

    return this.transactionModel.findAll({
      where: {
        [transactionType]: userAccountId,
      },
    });
  }

  public async getAllByDate(username: string, date: string) {
    const userAccountId = await this.getUserAccountId(username);

    return this.transactionModel.findAll({
      where: {
        transactionDate: date,
        [Op.or]: [
          { debitedAccountId: userAccountId },
          { creditedAccountId: userAccountId },
        ],
      },
    });
  }

  public async getAllByDateAndCashInOrCashOut(
    username: string,
    date: string,
    transactionType: string,
  ) {
    const userAccountId = await this.getUserAccountId(username);

    return this.transactionModel.findAll({
      where: {
        transactionDate: date,
        [transactionType]: userAccountId,
      },
    });
  }
}
