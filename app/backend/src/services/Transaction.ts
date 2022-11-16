import { ICreditedParams, ITransaction, ITransactionCreateParams } from '../interfaces/ITransaction';
import Accounts from '../database/models/Accounts';
import Transactions from '../database/models/Transactions';
import Users from '../database/models/Users';
import db from '../database/models';
import { Transaction } from 'sequelize';
import { StatusCodes } from 'http-status-codes';

export default class TransactionsService {
  constructor(
    private transactionModel: typeof Transactions,
    private userModel: typeof Users,
    private accountModel: typeof Accounts
  ) { }

  private async getUserAccountId(id: string,): Promise<string> {
    const result = await this.userModel.findByPk(id, {
      include: [{ model: Accounts }],
    })

    return result?.accountId || '';
  }

  private async getAccountBalance(accountId: string) {
    const result = await this.accountModel.findByPk(accountId);

    return result?.balance || 0;
  }

  private async isCreditedValueValid({ accountId, value }: ICreditedParams) {
    const userAccount = await this.accountModel.findByPk(accountId);

    if (userAccount && (value > userAccount.balance)) return null;

    return true;
  }

  private async validations({ accountId, value }: ICreditedParams) {
    const validateCreditedValue = await this.isCreditedValueValid(
      {
        accountId,
        value
      }
    );

    if (!validateCreditedValue) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: 'Credited value can not be greater than your balance'
      }
    }

    return null;
  }

  private async transactionCreate({ debitedAccountId, creditedAccountId, value }: ITransactionCreateParams, t: Transaction) {
    await this.transactionModel.create({
      debitedAccountId,
      creditedAccountId,
      value
    },
      { transaction: t });
  }

  private async accountBalanceUpdate(transactionCreateParams: ITransactionCreateParams, t: Transaction) {
    const creditedAccountBalance = await this.getAccountBalance(transactionCreateParams.creditedAccountId)
    const debitedAccountBalance = await this.getAccountBalance(transactionCreateParams.debitedAccountId);

    await this.accountModel.update(
      {
        balance: Number(creditedAccountBalance) - Number(transactionCreateParams.value)
      },
      {
        where: {
          id: transactionCreateParams.creditedAccountId
        },
        transaction: t
      })

    await this.accountModel.update(
      {
        balance: Number(debitedAccountBalance) + Number(transactionCreateParams.value)
      },
      {
        where: {
          id: transactionCreateParams.debitedAccountId
        },
        transaction: t
      })
  }

  public async create(transactionParams: ITransaction) {
    const t = await db.transaction();

    const creditedAccountId = await this.getUserAccountId(transactionParams.creditedAccountUserId);
    const validateData = await this.validations({ accountId: creditedAccountId, value: transactionParams.value });

    if (validateData) return validateData;

    try {
      await this.accountBalanceUpdate({
        creditedAccountId,
        debitedAccountId: transactionParams.debitedAccountId,
        value: transactionParams.value
      }, t);

      await this.transactionCreate(
        { debitedAccountId: transactionParams.debitedAccountId, creditedAccountId, value: transactionParams.value },
        t,
      )

      await t.commit();
    } catch (error) {
      await t.rollback();

      console.error(error);
      return null;
    }
  }
}